import {
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

import { Book } from './entities/book.entity';
import {
	FindBooksQueryDto,
	SearchBooksQueryDto,
	AladinBookResponse,
	AladinBookItemDto,
} from './dto';
import { LikesService } from '../likes/likes.service';

@Injectable()
export class BooksService {
	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService,
		@InjectRepository(Book)
		private bookRepository: Repository<Book>,
		private readonly likesService: LikesService,
	) {}

	async search(searchBookQueryDto: SearchBooksQueryDto) {
		try {
			const {
				keyword: query,
				keywordType: queryType,
				page,
				limit,
				sort,
				categoryId,
			} = searchBookQueryDto;
			const TTBKey = this.configService.get('ALADIN_TTB_KEY');

			const baseUrl = `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx`;
			const params = new URLSearchParams({
				TTBKey: TTBKey ?? '',
				Query: query,
				QueryType: queryType || 'Keyword',
				Start: page ? String(page) : '1',
				MaxResults: limit ? String(limit) : '20',
				Sort: sort || 'accuracy',
				Cover: 'Big',
				CategoryId: categoryId ? String(categoryId) : '0',
				Output: 'js',
				Version: '20131101',
			});
			const fullUrl = `${baseUrl}?${params.toString()}`;
			// console.log(`[BooksService] Requesting URL: ${fullUrl}`); // 3. 최종 요청 URL 확인

			const response = await this.httpService.axiosRef.get(fullUrl);
			// console.log(response.data);
			return response.data as AladinBookResponse;
		} catch {
			// console.error(error);
			throw new BadRequestException('Failed to fetch book details');
		}
	}

	async findAll(findBookQueryDto: FindBooksQueryDto) {
		try {
			const { page, limit, type: queryType, categoryId } = findBookQueryDto;
			const queryTypeMap: Record<string, string> = {
				today: 'ItemNewSpecial',
				new: 'ItemNewAll',
				best: 'Bestseller',
			};
			const mappedQueryType = queryTypeMap[queryType];
			if (!mappedQueryType) {
				console.log(mappedQueryType);
				throw new BadRequestException('Invalid query type');
			}

			const TTBKey = this.configService.get('ALADIN_TTB_KEY');
			const baseUrl = `http://www.aladin.co.kr/ttb/api/ItemList.aspx`;

			// today 타입일 때는 더 많은 데이터를 가져와서 추천 알고리즘 적용
			const actualLimit =
				queryType === 'today' ? '50' : limit ? String(limit) : '20';

			const params = new URLSearchParams({
				TTBKey: TTBKey ?? '',
				QueryType: mappedQueryType,
				SearchTarget: 'Book',
				Start: page ? String(page) : '1',
				MaxResults: actualLimit,
				Cover: 'Big',
				CategoryId: categoryId ? String(categoryId) : '0',
				Output: 'js',
				Version: '20131101',
			});
			const fullUrl = `${baseUrl}?${params.toString()}`;

			const response = await this.httpService.axiosRef.get(fullUrl);
			const aladinResponse = response.data as AladinBookResponse;

			// today 타입일 때만 추천 알고리즘 적용
			if (queryType === 'today' && aladinResponse.item) {
				console.log(
					`[BooksService] 추천 알고리즘 적용: ${aladinResponse.item.length}개 -> 5개 선별`,
				);
				const recommendedItems = this.applyRecommendationAlgorithm(
					aladinResponse.item,
				);
				return {
					...aladinResponse,
					item: recommendedItems,
					totalResults: recommendedItems.length,
					itemsPerPage: recommendedItems.length,
				};
			}

			return aladinResponse;
		} catch {
			// console.error(error);
			throw new BadRequestException('Failed to fetch book details');
		}
	}

	async findOne(isbn: string, userId?: string) {
		try {
			// 먼저 DB에서 책 정보 확인
			let book = await this.findBookByIsbn(isbn);

			if (!book) {
				// DB에 없으면 알라딘 API에서 가져와서 저장
				const TTBKey = this.configService.get('ALADIN_TTB_KEY');
				if (!TTBKey) {
					throw new BadRequestException('알라딘 API 키가 설정되지 않았습니다.');
				}
				const baseUrl = `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx`;
				const params = new URLSearchParams({
					TTBKey: TTBKey ?? '',
					ItemId: isbn,
					ItemIdType: 'ISBN13',
					Cover: 'Big',
					Output: 'js',
					Version: '20131101',
				});
				const fullUrl = `${baseUrl}?${params.toString()}`;

				const response = await this.httpService.axiosRef.get(fullUrl);

				const aladinResponse = response.data as AladinBookResponse;

				if (aladinResponse.item && aladinResponse.item.length > 0) {
					// 알라딘에서 받은 책 정보를 DB에 저장
					book = await this.saveBookFromAladin(aladinResponse.item[0]);
				}
			}

			// 좋아요 상태 확인 (로그인 안 된 경우 기본값 false)
			let isLiked = false;
			if (book && userId) {
				isLiked = await this.likesService.isLikedByUser(userId, book.isbn13);
			}

			// 메타데이터를 포함한 응답 반환
			return book ? this.mapBookToResponseDto(book, isLiked) : null;
		} catch {
			throw new BadRequestException('Failed to fetch book details');
		}
	}

	private mapBookToResponseDto(book: Book, isLiked: boolean = false) {
		return {
			version: '1.0.0',
			title: '도서 상세 정보',
			totalResults: 1,
			startIndex: 1,
			itemsPerPage: 1,
			item: [
				{
					id: book.isbn13,
					title: book.title,
					link: book.link,
					author: book.author,
					pubDate: book.pubDate,
					description: book.description,
					itemId: book.itemId,
					priceSales: book.priceSales,
					priceStandard: book.priceStandard,
					mallType: book.mallType,
					stockStatus: book.stockStatus,
					mileage: book.mileage,
					cover: book.cover,
					categoryId: book.categoryId,
					categoryName: book.categoryName,
					publisher: book.publisher,
					salesPoint: book.salesPoint,
					adult: book.adult,
					fixedPrice: book.fixedPrice,
					customerReviewRank: book.customerReviewRank,
					subTitle: book.subTitle,
					originalTitle: book.originalTitle,
					itemPage: book.itemPage,
					// 메타데이터
					createdAt: book.createdAt,
					updatedAt: book.updatedAt,
					reviewCount: book.reviewCount,
					// 좋아요 상태 (항상 포함, 비로그인시 false)
					isLiked: isLiked,
				},
			],
		};
	}

	async saveBookFromAladin(aladinBook: AladinBookItemDto): Promise<Book> {
		const existingBook = await this.bookRepository.findOne({
			where: { isbn13: aladinBook.isbn13 },
		});

		if (existingBook) {
			return existingBook;
		}

		const book = this.bookRepository.create({
			isbn13: aladinBook.isbn13,
			title: aladinBook.title,
			link: aladinBook.link,
			author: aladinBook.author,
			pubDate: aladinBook.pubDate,
			description: aladinBook.description,
			itemId: aladinBook.itemId,
			priceSales: aladinBook.priceSales,
			priceStandard: aladinBook.priceStandard,
			mallType: aladinBook.mallType,
			stockStatus: aladinBook.stockStatus,
			mileage: aladinBook.mileage,
			cover: aladinBook.cover,
			categoryId: aladinBook.categoryId,
			categoryName: aladinBook.categoryName,
			publisher: aladinBook.publisher,
			salesPoint: aladinBook.salesPoint,
			adult: aladinBook.adult,
			fixedPrice: aladinBook.fixedPrice,
			customerReviewRank: aladinBook.customerReviewRank,
			subTitle: aladinBook.subInfo?.subTitle,
			originalTitle: aladinBook.subInfo?.originalTitle,
			itemPage: aladinBook.subInfo?.itemPage,
			reviewCount: 0,
		});

		return this.bookRepository.save(book);
	}

	async findBookByIsbn(isbn: string): Promise<Book | null> {
		return await this.bookRepository.findOne({
			where: { isbn13: isbn },
		});
	}

	// 간단한 추천 알고리즘
	private applyRecommendationAlgorithm(
		books: AladinBookItemDto[],
	): AladinBookItemDto[] {
		// 스코어 계산
		const scoredBooks = books.map((book) => {
			let score = 0;

			// 1. 고객 평점 가중치 (최대 40점)
			if (book.customerReviewRank) {
				score += (book.customerReviewRank / 10) * 40;
			}

			// 2. 판매량 가중치 (최대 30점)
			if (book.salesPoint) {
				score += Math.min(book.salesPoint / 1000, 1) * 30;
			}

			// 3. 출간일 최신성 가중치 (최대 20점)
			if (book.pubDate) {
				const pubYear = new Date(book.pubDate).getFullYear();
				const currentYear = new Date().getFullYear();
				const yearDiff = currentYear - pubYear;
				if (yearDiff <= 1) score += 20;
				else if (yearDiff <= 3) score += 15;
				else if (yearDiff <= 5) score += 10;
			}

			// 4. 랜덤 요소 (최대 10점) - 다양성 확보
			score += Math.random() * 10;

			return { ...book, recommendationScore: score };
		});

		// 스코어 순으로 정렬하고 상위 5개 선택
		return scoredBooks
			.sort((a, b) => b.recommendationScore - a.recommendationScore)
			.slice(0, 5)
			.map(({ recommendationScore, ...book }) => book); // 스코어 제거하고 반환
	}
}

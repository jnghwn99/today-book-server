import {
	Injectable,
	NotFoundException,
	ConflictException,
} from '@nestjs/common';
import {
	CreateReviewDto,
	UpdateReviewDto,
	FindReviewsQueryDto,
	PaginatedReviewResponseDto,
	PaginationMetaDto,
} from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
	constructor(
		@InjectRepository(Review)
		private reviewRepository: Repository<Review>,
	) {}

	async create(isbn: string, createReviewDto: CreateReviewDto, userId: number) {
		// console.log('=== ReviewsService.create 호출 ===');
		// console.log('ISBN:', isbn);
		// console.log('Review DTO:', createReviewDto);
		// console.log('사용자 ID:', userId);

		// 1. 기존 리뷰 존재 여부 확인
		const existingReview = await this.reviewRepository.findOne({
			where: {
				bookIsbn13: isbn,
				userId: userId,
			},
		});

		if (existingReview) {
			throw new ConflictException(
				'이미 이 책에 대한 리뷰를 작성하셨습니다. 한 책당 하나의 리뷰만 작성할 수 있습니다.',
			);
		}

		// 2. 새 리뷰 생성
		const result = await this.reviewRepository.save({
			content: createReviewDto.content,
			bookIsbn13: isbn,
			userId: userId,
		});

		console.log('리뷰 저장 결과:', result);
		console.log('=== ReviewsService.create 완료 ===');
		return result;
	}

	async findReviewsByIsbn(
		isbn13: string,
		queryDto: FindReviewsQueryDto,
	): Promise<PaginatedReviewResponseDto> {
		const { page = 1, limit = 10 } = queryDto;

		// offset 계산
		const offset = (page - 1) * limit;

		// 총 개수 조회
		const totalItems = await this.reviewRepository.count({
			where: { bookIsbn13: isbn13 },
		});

		// 페이지네이션된 데이터 조회
		const reviews = await this.reviewRepository.find({
			where: { bookIsbn13: isbn13 },
			relations: ['user'],
			order: { createdAt: 'DESC' },
			skip: offset,
			take: limit,
		});

		// 페이지네이션 메타데이터 계산
		const totalPages = Math.ceil(totalItems / limit);
		const hasNextPage = page < totalPages;
		const hasPrevPage = page > 1;

		const pagination: PaginationMetaDto = {
			currentPage: page,
			totalPages,
			totalItems,
			itemsPerPage: limit,
			hasNextPage,
			hasPrevPage,
		};

		return {
			pagination,
			item: reviews,
		};
	}

	async update(
		isbn13: string,
		updateReviewDto: UpdateReviewDto,
		userId: number,
	) {
		// 1. 기존 리뷰 존재 여부 확인
		const existingReview = await this.reviewRepository.findOne({
			where: { bookIsbn13: isbn13, userId: userId },
		});

		if (!existingReview) {
			throw new NotFoundException(
				'수정할 리뷰를 찾을 수 없습니다. 먼저 리뷰를 작성해주세요.',
			);
		}

		// 2. 업데이트 수행
		await this.reviewRepository.update(
			{ bookIsbn13: isbn13, userId: userId },
			updateReviewDto,
		);

		// 3. 수정된 리뷰 반환
		return await this.reviewRepository.findOne({
			where: { bookIsbn13: isbn13, userId: userId },
			relations: ['user'],
		});
	}

	async remove(isbn13: string, userId: number) {
		// 1. 기존 리뷰 존재 여부 확인
		const existingReview = await this.reviewRepository.findOne({
			where: { bookIsbn13: isbn13, userId: userId },
		});

		if (!existingReview) {
			throw new NotFoundException('삭제할 리뷰를 찾을 수 없습니다.');
		}

		// 2. 삭제 수행
		await this.reviewRepository.delete({
			bookIsbn13: isbn13,
			userId: userId,
		});

		return {
			message: '리뷰가 성공적으로 삭제되었습니다.',
			deletedReviewId: existingReview.id,
		};
	}
}

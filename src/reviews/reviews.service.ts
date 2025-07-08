import { Injectable, NotFoundException } from '@nestjs/common';
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

	create(isbn: string, createReviewDto: CreateReviewDto, userId: number) {
		return this.reviewRepository.save({
			content: createReviewDto.content,
			bookIsbn13: isbn,
			userId: userId,
		});
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

	update(isbn13: string, updateReviewDto: UpdateReviewDto, userId: number) {
		return this.reviewRepository.update(
			{ bookIsbn13: isbn13, userId: userId },
			updateReviewDto,
		);
	}

	remove(isbn13: string, userId: number) {
		return this.reviewRepository.delete({
			bookIsbn13: isbn13,
			userId: userId,
		});
	}

	// ISBN과 리뷰 ID로 수정 (더 안전한 검증)
	async updateByIdAndIsbn(
		reviewId: number,
		isbn13: string,
		updateReviewDto: UpdateReviewDto,
		userId: number,
	) {
		// 1. 리뷰 존재 여부 및 권한 확인 (ID + ISBN + 사용자 모두 일치해야 함)
		const existingReview = await this.reviewRepository.findOne({
			where: {
				id: reviewId,
				bookIsbn13: isbn13,
				userId: userId,
			},
		});

		if (!existingReview) {
			throw new NotFoundException('수정할 리뷰를 찾을 수 없습니다.');
		}

		// 2. 업데이트 수행
		await this.reviewRepository.update({ id: reviewId }, updateReviewDto);

		// 3. 수정된 리뷰 반환 (user 정보 포함)
		const updatedReview = await this.reviewRepository.findOne({
			where: { id: reviewId },
			relations: ['user'],
		});

		return updatedReview;
	}

	// ISBN과 리뷰 ID로 삭제 (더 안전한 검증)
	async removeByIdAndIsbn(reviewId: number, isbn13: string, userId: number) {
		// 1. 리뷰 존재 여부 및 권한 확인 (ID + ISBN + 사용자 모두 일치해야 함)
		const existingReview = await this.reviewRepository.findOne({
			where: {
				id: reviewId,
				bookIsbn13: isbn13,
				userId: userId,
			},
		});

		if (!existingReview) {
			throw new NotFoundException('삭제할 리뷰를 찾을 수 없습니다.');
		}

		// 2. 삭제 수행
		const deleteResult = await this.reviewRepository.delete({ id: reviewId });

		// 3. 삭제 결과 반환
		if (deleteResult.affected === 0) {
			throw new Error('리뷰 삭제에 실패했습니다.');
		}

		return {
			message: '리뷰가 성공적으로 삭제되었습니다.',
			deletedReviewId: reviewId,
		};
	}
}

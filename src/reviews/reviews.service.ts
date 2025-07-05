import { Injectable } from '@nestjs/common';
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
      data: reviews,
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
}

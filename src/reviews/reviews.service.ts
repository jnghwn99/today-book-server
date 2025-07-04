import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  create(isbn: string, createCommentDto: CreateReviewDto, userId: number) {
    return this.reviewRepository.save({
      content: createCommentDto.content,
      bookId: isbn,
      userId: userId,
    });
  }

  findAll(isbn: string) {
    return this.reviewRepository.find({
      where: { bookId: isbn },
      relations: ['user', 'book'],
    });
  }

  update(isbn: string, updateCommentDto: UpdateReviewDto) {
    return this.reviewRepository.update(isbn, updateCommentDto);
  }

  remove(isbn: string) {
    return this.reviewRepository.delete(isbn);
  }
}

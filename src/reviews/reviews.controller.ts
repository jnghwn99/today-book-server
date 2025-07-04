import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto, FindReviewsQueryDto } from './dto';
import { extractTokenOrThrow } from '../common/utils/cookie.util';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly usersService: UsersService,
  ) {}

  @Post(':isbn')
  async create(
    @Param('isbn') isbn: string,
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: Request,
  ) {
    const token = extractTokenOrThrow(req);
    const user = await this.usersService.getCurrentUser(token);
    return this.reviewsService.create(isbn, createReviewDto, user.id);
  }

  @Get(':isbn')
  findReviewsByIsbn(
    @Param('isbn') isbn: string,
    @Query() queryDto: FindReviewsQueryDto,
  ) {
    return this.reviewsService.findReviewsByIsbn(isbn, queryDto);
  }

  @Patch(':isbn')
  update(
    @Param('isbn') isbn: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(isbn, updateReviewDto);
  }

  @Delete(':isbn')
  remove(@Param('isbn') isbn: string) {
    return this.reviewsService.remove(isbn);
  }
}

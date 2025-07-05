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

  @Post(':isbn13')
  async create(
    @Param('isbn13') isbn13: string,
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: Request,
  ) {
    const token = extractTokenOrThrow(req);
    const user = await this.usersService.getCurrentUser(token);
    return this.reviewsService.create(isbn13, createReviewDto, user.id);
  }

  @Get(':isbn13')
  findReviewsByIsbn(
    @Param('isbn13') isbn13: string,
    @Query() queryDto: FindReviewsQueryDto,
  ) {
    return this.reviewsService.findReviewsByIsbn(isbn13, queryDto);
  }

  @Patch(':isbn13')
  update(
    @Param('isbn13') isbn13: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(isbn13, updateReviewDto);
  }

  @Delete(':isbn13')
  remove(@Param('isbn13') isbn13: string) {
    return this.reviewsService.remove(isbn13);
  }
}

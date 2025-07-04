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
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
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
    @Body() createCommentDto: CreateReviewDto,
    @Req() req: Request,
  ) {
    const token = extractTokenOrThrow(req);
    const user = await this.usersService.getCurrentUser(token);
    return this.reviewsService.create(isbn, createCommentDto, user.id);
  }

  @Get(':isbn')
  findAll(@Param('isbn') isbn: string) {
    return this.reviewsService.findAll(isbn);
  }

  @Patch(':isbn')
  update(
    @Param('isbn') isbn: string,
    @Body() updateCommentDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(isbn, updateCommentDto);
  }

  @Delete(':isbn')
  remove(@Param('isbn') isbn: string) {
    return this.reviewsService.remove(isbn);
  }
}

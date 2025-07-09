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
	UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { FindBooksQueryDto, SearchBooksQueryDto } from './dto';
import { ReviewsService } from '../reviews/reviews.service';
import {
	CreateReviewDto,
	UpdateReviewWithIdDto,
	DeleteReviewWithIdDto,
	FindReviewsQueryDto,
} from '../reviews/dto';
import { Request } from 'express';
import { OptionalAuthGuard } from '../jwt-cookie/optional-auth.guard';

// Request 타입 확장
interface RequestWithUser extends Request {
	user: {
		id: number;
		email: string;
	};
}

@Controller('books')
export class BooksController {
	constructor(private readonly booksService: BooksService) {}

	@Get('search')
	search(@Query() searchBooksQueryDto: SearchBooksQueryDto) {
		return this.booksService.search(searchBooksQueryDto);
	}

	@Get(':isbn13')
	@UseGuards(OptionalAuthGuard)
	findOne(@Param('isbn13') isbn13: string, @Req() req?: RequestWithUser) {
		const userId = req?.user?.id; // 로그인하지 않은 경우도 처리
		return this.booksService.findOne(isbn13, userId);
	}

	@Get()
	findAll(@Query() findBooksQueryDto: FindBooksQueryDto) {
		return this.booksService.findAll(findBooksQueryDto);
	}
}

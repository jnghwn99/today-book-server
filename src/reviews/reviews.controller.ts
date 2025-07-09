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
	HttpCode,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, FindReviewsQueryDto, UpdateReviewDto } from './dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../jwt-cookie/jwt-auth.guard';

// Request 타입 확장
interface RequestWithUser extends Request {
	user: {
		id: string;
		email: string;
	};
}

@Controller('reviews')
export class ReviewsController {
	constructor(private readonly reviewsService: ReviewsService) {}

	@UseGuards(JwtAuthGuard)
	@Post(':isbn13')
	@HttpCode(201)
	async create(
		@Param('isbn13') isbn13: string,
		@Body() createReviewDto: CreateReviewDto,
		@Req() req: RequestWithUser,
	) {
		console.log('=== POST /reviews/:isbn13 호출됨 ===');
		console.log('ISBN13:', isbn13);
		console.log('Request Body:', createReviewDto);
		console.log('사용자 ID:', req.user.id);
		console.log('사용자 이메일:', req.user.email);

		const userId = req.user.id;
		const result = await this.reviewsService.create(
			isbn13,
			createReviewDto,
			userId,
		);

		console.log('리뷰 생성 결과:', result);
		console.log('=== POST 요청 처리 완료 ===');

		return result;
	}

	@Get(':isbn13')
	async findReviewsByIsbn(
		@Param('isbn13') isbn13: string,
		@Query() queryDto: FindReviewsQueryDto,
	) {
		return await this.reviewsService.findReviewsByIsbn(isbn13, queryDto);
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':isbn13')
	async update(
		@Param('isbn13') isbn13: string,
		@Body() updateReviewDto: UpdateReviewDto,
		@Req() req: RequestWithUser,
	) {
		const userId = req.user.id;
		return await this.reviewsService.update(isbn13, updateReviewDto, userId);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':isbn13')
	async remove(@Param('isbn13') isbn13: string, @Req() req: RequestWithUser) {
		const userId = req.user.id;
		return await this.reviewsService.remove(isbn13, userId);
	}
}

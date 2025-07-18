import {
	Controller,
	Post,
	Delete,
	Get,
	Body,
	Param,
	UseGuards,
	Request,
	HttpCode,
	HttpStatus,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../jwt-cookie/jwt-auth.guard';

@Controller('likes')
@UseGuards(JwtAuthGuard)
export class LikesController {
	constructor(private readonly likesService: LikesService) {}

	@Post(':isbn13')
	@HttpCode(HttpStatus.CREATED)
	async createLike(@Request() req, @Param('isbn13') isbn13: string) {
		const userId = req.user.id;
		const like = await this.likesService.createLike(userId, isbn13);
		return {
			...like,
			message: '좋아요가 추가되었습니다.',
			isLiked: true,
		};
	}

	@Delete(':isbn13')
	@HttpCode(HttpStatus.OK)
	async removeLike(@Request() req, @Param('isbn13') isbn13: string) {
		const userId = req.user.id;
		await this.likesService.removeLike(userId, isbn13);
		return {
			message: '좋아요가 취소되었습니다.',
			isLiked: false,
		};
	}

	@Get('me')
	async getUserLikes(@Request() req) {
		const userId = req.user.id;
		return await this.likesService.getUserLikes(userId);
	}

	@Get('book/:isbn13/count')
	async getBookLikes(@Param('isbn13') isbn13: string) {
		const count = await this.likesService.getBookLikes(isbn13);
		return { count };
	}

	@Get('book/:isbn13/check')
	async checkUserLike(@Request() req, @Param('isbn13') isbn13: string) {
		const userId = req.user.id;
		const isLiked = await this.likesService.isLikedByUser(userId, isbn13);
		return { isLiked };
	}
}

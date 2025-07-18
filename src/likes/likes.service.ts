import {
	Injectable,
	NotFoundException,
	ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { Book } from '../books/entities/book.entity';
import { User } from '../users/entities/user.entity';
import { LikeResponseDto, LikeWithBookResponseDto } from './dto';

@Injectable()
export class LikesService {
	constructor(
		@InjectRepository(Like)
		private readonly likeRepository: Repository<Like>,
		@InjectRepository(Book)
		private readonly bookRepository: Repository<Book>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async createLike(userId: string, isbn13: string): Promise<LikeResponseDto> {
		// 책이 존재하는지 확인
		const book = await this.bookRepository.findOne({
			where: { isbn13: isbn13 },
		});
		if (!book) {
			throw new NotFoundException('책을 찾을 수 없습니다.');
		}

		// 사용자가 존재하는지 확인
		const user = await this.userRepository.findOne({ where: { id: userId } });
		if (!user) {
			throw new NotFoundException('사용자를 찾을 수 없습니다.');
		}

		// 이미 좋아요를 눌렀는지 확인
		const existingLike = await this.likeRepository.findOne({
			where: { userId: userId, bookIsbn13: isbn13 },
		});

		if (existingLike) {
			throw new ConflictException('이미 좋아요를 눌렀습니다.');
		}

		// 좋아요 생성
		const like = this.likeRepository.create({
			userId: userId,
			bookIsbn13: isbn13,
		});

		const savedLike = await this.likeRepository.save(like);

		return {
			id: savedLike.id,
			userId: savedLike.userId,
			bookIsbn13: savedLike.bookIsbn13,
			createdAt: savedLike.createdAt,
			updatedAt: savedLike.updatedAt,
		};
	}

	async removeLike(userId: string, isbn13: string): Promise<void> {
		const like = await this.likeRepository.findOne({
			where: { userId: userId, bookIsbn13: isbn13 },
		});

		if (!like) {
			throw new NotFoundException('좋아요를 찾을 수 없습니다.');
		}

		await this.likeRepository.remove(like);
	}

	async getUserLikes(userId: string): Promise<LikeWithBookResponseDto[]> {
		const likes = await this.likeRepository.find({
			where: { userId: userId },
			relations: ['user', 'book'],
			order: { createdAt: 'DESC' }, // 최신순 정렬
		});

		return likes.map((like) => ({
			id: like.id,
			userId: like.userId,
			bookIsbn13: like.bookIsbn13,
			createdAt: like.createdAt,
			updatedAt: like.updatedAt,
			book: {
				isbn13: like.book.isbn13,
				title: like.book.title,
				author: like.book.author,
				publisher: like.book.publisher,
				pubDate: like.book.pubDate,
				cover: like.book.cover,
				description: like.book.description,
				priceSales: like.book.priceSales,
				priceStandard: like.book.priceStandard,
				categoryName: like.book.categoryName,
			},
		}));
	}

	async getBookLikes(isbn13: string): Promise<number> {
		const count = await this.likeRepository.count({
			where: { bookIsbn13: isbn13 },
		});

		return count;
	}

	async isLikedByUser(userId: string, isbn13: string): Promise<boolean> {
		const like = await this.likeRepository.findOne({
			where: { userId: userId, bookIsbn13: isbn13 },
		});

		return !!like;
	}
}

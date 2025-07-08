import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { Like } from './entities/like.entity';
import { Book } from '../books/entities/book.entity';
import { User } from '../users/entities/user.entity';
import { JwtCookieModule } from '../jwt-cookie/jwt-cookie.module';

@Module({
	imports: [TypeOrmModule.forFeature([Like, Book, User]), JwtCookieModule],
	controllers: [LikesController],
	providers: [LikesService],
	exports: [LikesService],
})
export class LikesModule {}

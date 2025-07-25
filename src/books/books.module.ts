import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { Book } from './entities/book.entity';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { LikesModule } from '../likes/likes.module';
import { JwtCookieModule } from '../jwt-cookie/jwt-cookie.module';

@Module({
	imports: [
		HttpModule,
		ConfigModule,
		TypeOrmModule.forFeature([Book]),
		LikesModule,
		JwtCookieModule,
	],
	controllers: [BooksController],
	providers: [BooksService],
	exports: [BooksService],
})
export class BooksModule {}

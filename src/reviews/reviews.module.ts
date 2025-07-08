import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { JwtCookieModule } from '../jwt-cookie/jwt-cookie.module';

@Module({
	imports: [TypeOrmModule.forFeature([Review]), JwtCookieModule],
	controllers: [ReviewsController],
	providers: [ReviewsService],
})
export class ReviewsModule {}

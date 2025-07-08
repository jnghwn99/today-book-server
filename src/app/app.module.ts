import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { BooksModule } from '../books/books.module';
import { UsersModule } from '../users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReviewsModule } from '../reviews/reviews.module';
import { LikesModule } from '../likes/likes.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env.local', '.env'], // .env.local 우선, 없으면 .env
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				type: config.get<'postgres'>('DB_TYPE', 'postgres'),
				host: config.get<string>('DB_HOST', 'localhost'),
				port: config.get<number>('DB_PORT', 5432),
				username: config.get<string>('DB_USERNAME', 'postgres'),
				password: config.get<string>('DB_PASSWORD', 'postgres'),
				database: config.get<string>('DB_DATABASE', 'postgres'),
				entities: [__dirname + '/../**/*.entity{.ts,.js}'],
				dropSchema: config.get<boolean>('DB_DROP_SCHEMA', false),
				synchronize: config.get<boolean>('DB_SYNCHRONIZE', false),
				logging: config.get<boolean>('DB_LOGGING', false),
				retryAttempts: config.get<number>('DB_RETRY_ATTEMPTS', 3),
				retryDelay: config.get<number>('DB_RETRY_DELAY', 3000),
			}),
		}),
		BooksModule,
		AuthModule,
		UsersModule,
		ReviewsModule,
		LikesModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}

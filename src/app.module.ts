import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BooksModule } from './books/books.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: process.env.DB_HOST || 'localhost',
    //   port: parseInt(process.env.DB_PORT || '3306'),
    //   username: process.env.DB_USERNAME || 'root',
    //   password: process.env.DB_PASSWORD || 'root',
    //   database: process.env.DB_DATABASE || 'today_book',
    //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //   dropSchema: process.env.DB_DROP_SCHEMA === 'true',
    //   synchronize: process.env.DB_SYNCHRONIZE === 'true',
    //   logging: process.env.DB_LOGGING === 'true',
    //   retryAttempts: parseInt(process.env.DB_RETRY_ATTEMPTS || '3'),
    //   retryDelay: parseInt(process.env.DB_RETRY_DELAY || '3000'),
    // }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: config.get<'mysql'>('DB_TYPE', 'mysql'),
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', 'root'),
        database: config.get<string>('DB_DATABASE', 'today_book'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

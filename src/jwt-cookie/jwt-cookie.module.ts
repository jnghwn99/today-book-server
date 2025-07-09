import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtCookieService } from './jwt-cookie.service';
import { JwtCookieController } from './jwt-cookie.controller';
import { OptionalAuthGuard } from './optional-auth.guard';

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET'),
				signOptions: {
					expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
				},
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [JwtCookieController],
	providers: [JwtCookieService, OptionalAuthGuard],
	exports: [JwtCookieService, OptionalAuthGuard],
})
export class JwtCookieModule {}

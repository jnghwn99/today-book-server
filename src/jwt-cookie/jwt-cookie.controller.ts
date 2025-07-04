import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtCookieService } from './jwt-cookie.service';
import { JwtCookiePayload } from './dto/jwt-cookie-payload.dto';
import { ConfigService } from '@nestjs/config';

@Controller('jwt-cookie')
export class JwtCookieController {
  constructor(
    private readonly jwtCookieService: JwtCookieService,
    private readonly configService: ConfigService,
  ) {}

  @Post('test-sign')
  createTestToken(@Body() payload: JwtCookiePayload) {
    // 개발 환경에서만 허용
    if (this.configService.get<string>('NODE_ENV') !== 'development') {
      throw new HttpException(
        '개발 환경에서만 사용 가능합니다.',
        HttpStatus.FORBIDDEN,
      );
    }
    return { token: this.jwtCookieService.signTestToken(payload) };
  }

  @Get('test-verify')
  verifyToken(@Query('token') token: string) {
    // 개발 환경에서만 허용
    if (this.configService.get<string>('NODE_ENV') !== 'development') {
      throw new HttpException(
        '개발 환경에서만 사용 가능합니다.',
        HttpStatus.FORBIDDEN,
      );
    }
    try {
      const payload = this.jwtCookieService.verifyJwt(token);
      return {
        valid: true,
        payload,
        message: '토큰이 유효합니다.',
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message,
        message: '토큰이 유효하지 않습니다.',
      };
    }
  }
}

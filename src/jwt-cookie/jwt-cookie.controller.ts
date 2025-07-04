import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtCookieService } from './jwt-cookie.service';
import { ConfigService } from '@nestjs/config';
import { JwtCookiePayload } from './dto/jwt-cookie-payload.dto';
import { Response } from 'express';

@Controller('jwt-cookie')
export class JwtCookieController {
  constructor(
    private readonly jwtCookieService: JwtCookieService,
    private readonly configService: ConfigService,
  ) {}

  @Post('test-sign')
  async createTestToken(
    @Body() jwtCookiePayload: JwtCookiePayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    // 개발 환경에서만 허용
    if (this.configService.get<string>('NODE_ENV') !== 'development') {
      throw new HttpException(
        '개발 환경에서만 사용 가능합니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    // 클래스 인스턴스를 일반 객체로 변환
    const plainPayload = {
      id: jwtCookiePayload.id,
      email: jwtCookiePayload.email,
    };

    // JWT 토큰 생성 및 쿠키에 설정
    const token = await this.jwtCookieService.setJwtCookie(res, plainPayload);

    return {
      message: 'JWT 토큰이 생성되고 쿠키에 설정되었습니다.',
      token,
      payload: plainPayload,
    };
  }

  @Get('test-verify')
  async verifyToken(@Query('token') token: string) {
    // 개발 환경에서만 허용
    if (this.configService.get<string>('NODE_ENV') !== 'development') {
      throw new HttpException(
        '개발 환경에서만 사용 가능합니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      const payload = await this.jwtCookieService.verifyJwt(token);
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

  @Post('logout')
  logout(@Res() res: Response) {
    // 개발 환경에서만 허용
    if (this.configService.get<string>('NODE_ENV') !== 'development') {
      throw new HttpException(
        '개발 환경에서만 사용 가능합니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    this.jwtCookieService.clearJwtCookie(res);
    return {
      message: '로그아웃되었습니다.',
    };
  }
}

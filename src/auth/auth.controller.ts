import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Post,
  Redirect,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller(`auth`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao')
  @Redirect()
  kakaoLogin() {
    const kakaoAuthUrl = this.authService.kakaoLogin();
    return { url: kakaoAuthUrl };
  }

  @Get('kakao/callback')
  async kakaoLoginCallback(@Query('code') code: string, @Res() res: Response) {
    try {
      const result = await this.authService.kakaoLoginCallback(code);
      const token = result.token;
      const url = result.url; // CLIENT_URL

      // JWT 토큰을 쿠키에 저장
      res.cookie('jwt_token', token, {
        httpOnly: true,
        secure: false, // 배포 시 true 권장
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
      });

      console.log(token);
      // CLIENT_URL로 리다이렉트
      return res.redirect(url);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: '로그인 처리 중 오류가 발생했습니다.',
      });
    }
  }

  // 로그아웃 엔드포인트
  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('jwt_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });

    return {
      statusCode: HttpStatus.OK,
      message: '로그아웃 성공',
    };
  }
}

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
  async kakaoLoginCallback(
    @Query('code') code: string,
    @Query('error') error: string,
    @Query('error_description') error_description: string,
    @Query('state') state: string,
  ) {
    try {
      const result = await this.authService.kakaoLoginCallback(code);

      const token = result.jwtToken;

      console.log('JWT 토큰:', token);

      // POST 응답으로 JWT 토큰 반환
      return {
        statusCode: HttpStatus.OK,
        message: '로그인 성공',
        data: {
          token,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: '로그인 처리 중 오류가 발생했습니다.',
      };
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

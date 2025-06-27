import { Controller, Get, HttpStatus, Query, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';

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
    // console.log(code);
    // console.log(error);
    try {
      const result = await this.authService.kakaoLoginCallback(code);
      return {
        statusCode: HttpStatus.OK,
        message: '로그인 성공',
        data: {
          user: {
            email: result.user.email,
            nickname: result.user.nickname,
            profileImage: result.user.profileImage,
          },
          tokens: {
            jwtToken: result.token,
          },
        },
      };
    } catch (error) {
      console.log(error);
    }
  }
}

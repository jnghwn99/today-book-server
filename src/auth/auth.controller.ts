import { Controller, Get, Query, Redirect } from '@nestjs/common';
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
      const res = await this.authService.kakaoLoginCallback(code);
      return res;
    } catch (error) {
      console.log(error);
    }
  }
}

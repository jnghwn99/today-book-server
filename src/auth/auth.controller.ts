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
  @Redirect()
  async kakaoLoginCallback(@Query('code') code: string, @Res() res: Response) {
    const url = await this.authService.kakaoLoginCallback(code, res);
    return { url };
  }
}

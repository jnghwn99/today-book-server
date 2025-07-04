import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { JwtCookiePayload } from './dto/jwt-cookie-payload.dto';

@Injectable()
export class JwtCookieService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signJwt(
    jwtCookiePayload: JwtCookiePayload | { id: number; email: string },
  ): Promise<string> {
    return await this.jwtService.signAsync(jwtCookiePayload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });
  }

  async verifyJwt(token: string): Promise<JwtCookiePayload> {
    if (!token) {
      throw new HttpException('토큰이 없습니다', HttpStatus.BAD_REQUEST);
    }

    // 토큰에서 앞뒤 따옴표 제거
    const cleanToken = token.replace(/^["']|["']$/g, '');

    try {
      const payload: JwtCookiePayload = await this.jwtService.verifyAsync(
        cleanToken,
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );
      return payload;
    } catch (error) {
      console.error('JWT 토큰 검증 실패:', error);
      throw new HttpException('JWT 토큰 검증 실패', HttpStatus.BAD_REQUEST);
    }
  }

  async setJwtCookie(
    res: Response,
    payload: JwtCookiePayload | { id: number; email: string },
  ): Promise<string> {
    const jwtToken = await this.signJwt(payload);

    const cookieOptions = {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 24 * 60 * 60 * 1000, // 24시간
    };

    res.cookie('jwt_token', jwtToken, cookieOptions);
    return jwtToken;
  }

  clearJwtCookie(res: Response): void {
    res.clearCookie('jwt_token', {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }
}

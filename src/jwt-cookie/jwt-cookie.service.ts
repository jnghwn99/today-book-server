import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';
import { JwtCookiePayload } from './dto/jwt-cookie-payload.dto';

@Injectable()
export class JwtCookieService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  extractTokenOrThrow(req: Request, cookieKey = 'jwt_token'): string {
    console.log('=== JWT 토큰 추출 디버깅 ===');
    console.log('req.cookies:', req.cookies);
    console.log('cookieKey:', cookieKey);
    console.log('Headers:', req.headers);
    
    if (!req.cookies) {
      console.log('❌ req.cookies가 undefined 또는 null');
      throw new UnauthorizedException('쿠키가 없습니다. cookie-parser 설정을 확인하세요.');
    }
    
    if (!req.cookies[cookieKey]) {
      console.log('❌ JWT 토큰 쿠키를 찾을 수 없음');
      console.log('사용 가능한 쿠키 목록:', Object.keys(req.cookies));
      throw new UnauthorizedException('JWT 토큰이 없습니다.');
    }
    
    console.log('✅ JWT 토큰 발견:', req.cookies[cookieKey]);
    return req.cookies[cookieKey];
  }

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

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
    if (!req.cookies || !req.cookies[cookieKey]) {
      throw new UnauthorizedException('JWT 토큰이 없습니다.');
    }
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

    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const isProduction = nodeEnv === 'production';
      
    const cookieOptions = {
      httpOnly: true,
      secure: Boolean(isProduction), // 명시적으로 boolean 변환
      sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax', // 환경에 따라 동적 설정
      path: '/',
      maxAge: 24 * 60 * 60 * 1000, // 24시간
    };

    res.cookie('jwt_token', jwtToken, cookieOptions);
    return jwtToken;
  }

  clearJwtCookie(res: Response): void {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const isProduction = nodeEnv === 'production';
    
    res.clearCookie('jwt_token', {
      httpOnly: true,
      secure: Boolean(isProduction), // 명시적으로 boolean 변환
      sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax', // 환경에 따라 동적 설정
      path: '/',
    });
  }
}

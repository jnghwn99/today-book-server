import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { JwtCookiePayload } from './dto/jwt-cookie-payload.dto';

@Injectable()
export class JwtCookieService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  async signJwt(user: User): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
    };
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });
  }

  async verifyJwt(token: string): Promise<JwtCookiePayload> {
    try {
      const payload: JwtCookiePayload = await this.jwtService.verifyAsync(
        token,
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

  // 테스트용 토큰 생성 (개발 환경에서만 사용)
  signTestToken(payload: { id: number; email: string }): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });
  }
}

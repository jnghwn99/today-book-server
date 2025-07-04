import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from '../auth/types/jwt.type';

@Injectable()
export class JwtService {
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

  async verifyJwt(token: string): Promise<JwtPayload> {
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return payload;
    } catch (error) {
      console.error('JWT 토큰 검증 실패:', error);
      throw new HttpException('JWT 토큰 검증 실패', HttpStatus.BAD_REQUEST);
    }
  }
}

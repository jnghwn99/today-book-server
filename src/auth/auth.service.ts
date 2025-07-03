import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  KakaoTokenResponse,
  KakaoIdTokenPayload,
  KakaoTokenRequest,
} from './types/kakao.type';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  kakaoLogin() {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}&response_type=code&prompt=login`;
    return kakaoAuthUrl;
  }

  async getKakaoToken(code: string) {
    const params: KakaoTokenRequest = {
      grant_type: 'authorization_code',
      client_id: this.configService.get<string>('KAKAO_ID')!,
      redirect_uri: this.configService.get<string>('KAKAO_REDIRECT_URI')!,
      code: code,
      client_secret: this.configService.get<string>('KAKAO_SECRET')!,
    };
    const kakaoTokenResponse =
      await this.httpService.axiosRef.post<KakaoTokenResponse>(
        'https://kauth.kakao.com/oauth/token',
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );
    return kakaoTokenResponse.data;
  }

  async kakaoLoginCallback(code: string, res: Response) {
    try {
      // 1. 카카오 토큰 발급
      const kakaoTokenResponse = await this.getKakaoToken(code);

      // 2. 카카오 유저 정보 조회
      const userInfo = this.decodeKakaoIdToken(kakaoTokenResponse.id_token);

      const userData = {
        email: userInfo.email,
        nickname: userInfo.nickname,
        image: userInfo.picture,
      };

      let user = await this.usersService.findByEmail(userData.email);
      if (!user) {
        user = await this.usersService.create(userData);
      }
      const jwtToken = await this.setJwt(user);

      res.cookie('jwt_token', jwtToken, {
        httpOnly: true,
        secure: false, // 배포 시 true 권장
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
      });
      return this.configService.get<string>('CLIENT_URL');
    } catch (error) {
      console.error('카카오 로그인 처리 중 오류:', error);
      throw new HttpException(
        '카카오 로그인 처리 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private decodeKakaoIdToken(idToken: string): KakaoIdTokenPayload {
    try {
      const base64Url = idToken.split('.')[1];
      const decodedPayloadBuffer = Buffer.from(base64Url, 'base64url');

      const decodedPayload = JSON.parse(
        decodedPayloadBuffer.toString('utf-8'),
      ) as KakaoIdTokenPayload;

      return decodedPayload;
    } catch (error) {
      throw new HttpException('ID 토큰 디코딩 실패', HttpStatus.BAD_REQUEST);
    }
  }

  async setJwt(user: User) {
    const payload = {
      email: user.email,
    };
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });
  }
}

import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { KakaoTokenResponse, KakaoUserResponse } from './types/kakao.type';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
  ) {}

  kakaoLogin() {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}&response_type=code&prompt=login`;
    return kakaoAuthUrl;
  }

  async kakaoLoginCallback(code: string) {
    const clientId = process.env.KAKAO_ID;
    const redirectUri = process.env.KAKAO_REDIRECT_URI;
    const clientSecret = process.env.KAKAO_SECRET;

    if (!clientId || !redirectUri || !clientSecret) {
      throw new HttpException(
        '카카오 설정이 누락되었습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const tokenResponse = await this.getKakaoToken(
        code,
        clientId,
        redirectUri,
        clientSecret,
      );
      const kakaoUserInfo = await this.getKakaoUserInfo(
        tokenResponse.access_token,
      );
      const kakaoEmail = kakaoUserInfo.kakao_account.email;
      if (!kakaoEmail) {
        throw new HttpException(
          '카카오 계정에 이메일이 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      let user = await this.usersService.findByEmail(kakaoEmail);

      if (!user) {
        user = await this.usersService.create({
          email: kakaoEmail,
        });
      }

      return {
        user: kakaoUserInfo,
        token: tokenResponse.access_token,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getKakaoToken(
    code: string,
    clientId: string,
    redirectUri: string,
    clientSecret: string,
  ): Promise<KakaoTokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      redirect_uri: redirectUri,
      code: code,
      client_secret: clientSecret,
    }).toString();

    const response = await this.httpService.axiosRef.post<KakaoTokenResponse>(
      'https://kauth.kakao.com/oauth/token',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      },
    );
    return response.data;
  }

  async getKakaoUserInfo(accessToken: string): Promise<KakaoUserResponse> {
    try {
      const response = await this.httpService.axiosRef.get<KakaoUserResponse>(
        'https://kapi.kakao.com/v2/user/me',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        '사용자 정보 조회 실패',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

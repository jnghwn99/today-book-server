import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { KakaoTokenResponse, KakaoUserResponse } from './types/kakao.type';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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
      // console.log(kakaoUserInfo);

      const userData = {
        kakaoId: kakaoUserInfo.id.toString(),
        email: kakaoUserInfo.kakao_account.email ?? '',
        nickname: kakaoUserInfo.kakao_account.profile?.nickname ?? '',
        profileImage:
          kakaoUserInfo.kakao_account.profile?.profile_image_url ?? '',
      };
      let user = await this.usersService.findByEmail(userData.email);
      if (!user) {
        user = await this.usersService.create(userData);
      }

      const payload = {
        email: user.email,
        nickname: user.nickname,
        profileImage: user.profileImage,
      };
      const jwtToken = this.jwtService.sign(payload);

      return {
        user: user,
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

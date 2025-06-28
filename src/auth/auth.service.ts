import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { KakaoTokenResponse, KakaoIdTokenPayload } from './types/kakao.type';
import { HttpService } from '@nestjs/axios';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

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
      // console.log(tokenResponse);
      const userInfo = this.decodeIdToken(tokenResponse.id_token);

      const userData = {
        email: userInfo.email,
        nickname: userInfo.nickname,
        image: userInfo.picture,
      };
      // console.log(userData);

      let user = await this.usersService.findByEmail(userData.email);
      if (!user) {
        user = await this.usersService.create(userData);
      }

      // JWT 토큰 생성
      const jwtPayload = {
        email: user.email,
      };

      const jwtToken = await this.jwtService.signAsync(jwtPayload);

      return {
        jwtToken,
      };
    } catch (error) {
      console.error('카카오 로그인 처리 중 오류:', error);
      throw new HttpException(
        '카카오 로그인 처리 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private decodeIdToken(idToken: string): KakaoIdTokenPayload {
    try {
      // JWT 토큰을 디코딩 (검증 없이)
      const base64Url = idToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      return JSON.parse(jsonPayload) as KakaoIdTokenPayload;
    } catch (error) {
      throw new HttpException('ID 토큰 디코딩 실패', HttpStatus.BAD_REQUEST);
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
}

import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

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
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        redirect_uri: redirectUri,
        code: code,
        client_secret: clientSecret,
      }).toString();

      const response = await this.httpService.axiosRef.post(
        'https://kauth.kakao.com/oauth/token',
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );
      console.log(response.data);
      const userInfo = await this.getKakaoUserInfo(response.data.access_token);
      console.log(userInfo);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getKakaoUserInfo(accessToken: string) {
    try {
      const response = await this.httpService.axiosRef.get(
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

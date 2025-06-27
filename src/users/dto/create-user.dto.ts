import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  //body.id : long
  @IsString()
  kakaoId: string;

  //body->kakao_account.email : KakaoAccount:string
  @IsEmail()
  email: string;

  //body -> kakao_account.profile.nickname : KakaoAccount:Profile:string
  @IsString()
  nickname: string;

  //body -> kakao_account.profile.profile_image_url : KakaoAccount:Profile:string
  @IsString()
  profileImage: string;
}

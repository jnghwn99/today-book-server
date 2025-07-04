import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class KakaoTokenResponseDto {
  @IsString()
  @IsNotEmpty()
  token_type: string;

  @IsString()
  @IsNotEmpty()
  access_token: string;

  @IsString()
  id_token: string;

  @IsNumber()
  @IsNotEmpty()
  expires_in: number;

  @IsString()
  @IsNotEmpty()
  refresh_token: string;

  @IsNumber()
  @IsNotEmpty()
  refresh_token_expires_in: number;

  @IsOptional()
  @IsString()
  scope?: string;
}

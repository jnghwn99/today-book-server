import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class JwtCookiePayload {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

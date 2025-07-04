import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class JwtPayload {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

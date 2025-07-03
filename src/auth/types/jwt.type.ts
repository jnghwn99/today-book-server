import { IsEmail, IsNotEmpty } from 'class-validator';

export class JwtPayload {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

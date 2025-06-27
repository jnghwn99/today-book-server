import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // @IsString()
  // provider?: string;

  // @IsString()
  // providerId?: string;
}

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class JwtCookiePayload {
	@IsString()
	@IsNotEmpty()
	id: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;
}

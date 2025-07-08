import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class KakaoIdTokenPayloadDto {
	@IsString()
	@IsNotEmpty()
	iss: string;

	@IsString()
	@IsNotEmpty()
	aud: string;

	@IsString()
	@IsNotEmpty()
	sub: string;

	@IsNumber()
	@IsNotEmpty()
	iat: number;

	@IsNumber()
	@IsNotEmpty()
	exp: number;

	@IsNumber()
	@IsNotEmpty()
	auth_time: number;

	@IsString()
	nonce: string;

	@IsString()
	nickname: string;

	@IsString()
	picture: string;

	@IsString()
	email: string;
}

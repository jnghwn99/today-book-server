import {
	Injectable,
	CanActivate,
	ExecutionContext,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtCookieService } from './jwt-cookie.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(private readonly jwtCookieService: JwtCookieService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		try {
			const token = this.jwtCookieService.extractTokenOrThrow(request);
			const payload = await this.jwtCookieService.verifyJwt(token);

			// 요청 객체에 사용자 정보 추가
			request.user = payload;

			return true;
		} catch (error) {
			console.error('JWT 인증 실패:', error.message);
			throw new UnauthorizedException('인증이 필요합니다.');
		}
	}
}

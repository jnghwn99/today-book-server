import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtCookieService } from './jwt-cookie.service';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
	constructor(private readonly jwtCookieService: JwtCookieService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		try {
			const token = this.jwtCookieService.extractTokenOrThrow(request);
			const payload = await this.jwtCookieService.verifyJwt(token);

			// 요청 객체에 사용자 정보 추가
			request.user = payload;
		} catch {
			// 토큰이 없거나 유효하지 않아도 요청을 통과시킴
			request.user = null;
		}

		return true; // 항상 true 반환
	}
}

import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

export function extractTokenOrThrow(
  req: Request,
  cookieKey = 'jwt_token',
): string {
  if (!req.cookies || !req.cookies[cookieKey]) {
    throw new UnauthorizedException('JWT 토큰이 없습니다.');
  }
  return req.cookies[cookieKey];
}

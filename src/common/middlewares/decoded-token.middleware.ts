import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiService } from '../utils/api/api.service';
import { AuthService } from 'src/app/auth/auth.service';
import {
  COOKIE_ACCESS_TOKEN_KEY,
  COOKIE_REFRESH_TOKEN_KEY,
} from 'src/consts/cookie.const';

@Injectable()
export class DecodedTokenMiddleware implements NestMiddleware {
  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (this.apiService.isPathNotAuth(req.originalUrl)) return next();
    const token =
      req.cookies[COOKIE_ACCESS_TOKEN_KEY] ??
      this.apiService.getBearerToken(req.headers) ??
      req.cookies[COOKIE_REFRESH_TOKEN_KEY];

    if (!token) throw new UnauthorizedException('Token is required!');
    const { decoded, error } = await this.authService.verifyToken(token);
    if (error) throw error;

    const { exp, ...payload } = decoded;
    const userRequest = req.user ?? {};
    req.user = { ...userRequest, ...payload };
    return next();
  }
}

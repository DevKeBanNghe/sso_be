import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { KEY_FROM_DECODED_TOKEN } from 'src/consts/jwt.const';
import { TokenExpiredError } from '@nestjs/jwt';
import { ApiService } from '../utils/api/api.service';
import { AuthService } from 'src/app/auth/auth.service';
import { SaveTokenInterceptor } from 'src/app/auth/interceptors/save-token.interceptor';
import {
  COOKIE_ACCESS_TOKEN_KEY,
  COOKIE_REFRESH_TOKEN_KEY,
} from 'src/consts/cookie.const';

@Injectable()
export class DecodedTokenMiddleware implements NestMiddleware {
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private saveTokenInterceptor: SaveTokenInterceptor
  ) {}

  private async handleRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const refresh_token = req.cookies[COOKIE_REFRESH_TOKEN_KEY];
    if (!refresh_token)
      return next(new UnauthorizedException('Refresh token is required'));

    const { decoded, error } = await this.authService.verifyToken(
      refresh_token
    );
    if (error) return next(error);

    const { exp, ...payload } = decoded;
    // Set new token to cookie
    this.saveTokenInterceptor.setTokenToCookie(
      res,
      await this.authService.createToken(payload)
    );
    req.body[KEY_FROM_DECODED_TOKEN] = payload;
    next();
  }

  private getTokenFromHeaders(req: Request) {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer '))
      return authHeader.substring(7, authHeader.length);
  }

  async use(req: Request, res: Response, next: NextFunction) {
    if (this.apiService.isPathNotAuth(req.originalUrl)) return next();
    const access_token =
      req.cookies[COOKIE_ACCESS_TOKEN_KEY] ?? this.getTokenFromHeaders(req);
    if (!access_token) {
      const refresh_token = req.cookies[COOKIE_REFRESH_TOKEN_KEY];
      if (refresh_token) return this.handleRefreshToken(req, res, next);
      return next(new UnauthorizedException('Token is required'));
    }

    const { decoded, error } = await this.authService.verifyToken(access_token);
    if (decoded) {
      const { exp, ...payload } = decoded;
      req.body[KEY_FROM_DECODED_TOKEN] = payload;
      return next();
    }

    if (!(error instanceof TokenExpiredError)) return next(error);
    this.handleRefreshToken(req, res, next);
  }
}

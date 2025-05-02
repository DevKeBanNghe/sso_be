import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { map } from 'rxjs';
import { SaveTokenInterceptor } from './save-token.interceptor';
import { Request, Response } from 'express';
import {
  COOKIE_REDIRECT_KEY,
  cookieConfigsDefault,
} from 'src/consts/cookie.const';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/consts/env.const';

@Injectable()
export class RedirectToInterceptor {
  constructor(
    private saveTokenInterceptor: SaveTokenInterceptor,
    private configService: ConfigService
  ) {}
  intercept(context: ExecutionContext, next: CallHandler) {
    const { getRequest, getResponse } = context.switchToHttp();
    const req = getRequest<Request>();
    const res = getResponse<Response>();
    return next.handle().pipe(
      map(async (data) => {
        this.saveTokenInterceptor.setTokenToCookie(res, data);
        const webpage_url =
          data.webpage_url ?? this.configService.get(EnvVars.FE_URL);
        res.clearCookie(COOKIE_REDIRECT_KEY, cookieConfigsDefault);
        if (webpage_url) {
          try {
            res.redirect(webpage_url);
          } catch (error) {
            Logger.error(error.message, { ...data, webpage_url });
          }
        }
        return data;
      })
    );
  }
}

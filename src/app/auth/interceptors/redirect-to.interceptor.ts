import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { map } from 'rxjs';
import { SaveTokenInterceptor } from './save-token.interceptor';
import { COOKIE_REDIRECT_KEY } from 'src/consts/cookie.const';
import { Request, Response } from 'express';

@Injectable()
export class RedirectToInterceptor {
  constructor(private saveTokenInterceptor: SaveTokenInterceptor) {}
  intercept(context: ExecutionContext, next: CallHandler) {
    const { getRequest, getResponse } = context.switchToHttp();
    const req = getRequest<Request>();
    const res = getResponse<Response>();
    return next.handle().pipe(
      map(async (data) => {
        this.saveTokenInterceptor.setTokenToCookie(res, data);
        res.clearCookie(COOKIE_REDIRECT_KEY);
        const webpage_url = data.webpage_url;
        if (webpage_url) {
          try {
            res.redirect(webpage_url);
          } catch (error) {
            console.log('🚀 ~ RedirectToInterceptor ~ map ~ error:', error);
          }
        }
        return data;
      })
    );
  }
}

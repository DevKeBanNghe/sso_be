import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { SaveTokenInterceptor } from './save-token.interceptor';
import { COOKIE_REDIRECT_KEY } from 'src/consts/cookie.const';
import { Request, Response } from 'express';
import { WebRedirectDto } from '../dto/web.dto';

@Injectable()
export class RedirectToInterceptor extends SaveTokenInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { getRequest, getResponse } = context.switchToHttp();
    const req = getRequest<Request>();
    const res = getResponse<Response>();
    return next.handle().pipe(
      map((data) => {
        super.setTokenToCookie(res, data);
        const cookie_data = req.cookies[COOKIE_REDIRECT_KEY] as WebRedirectDto;
        res.clearCookie(COOKIE_REDIRECT_KEY);
        if (cookie_data?.from_url) res.redirect(cookie_data.from_url);
        return data;
      })
    );
  }
}

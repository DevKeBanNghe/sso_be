import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AuthToken } from '../interfaces/token.interface';
import { Request, Response } from 'express';
import {
  COOKIE_ACCESS_TOKEN_KEY,
  COOKIE_REFRESH_TOKEN_KEY,
  cookieConfigsDefault,
} from 'src/consts/cookie.const';

@Injectable()
export class SaveTokenInterceptor implements NestInterceptor {
  setTokenToCookie(res: Response, { access_token, refresh_token }: AuthToken) {
    if (access_token) {
      res.cookie(COOKIE_ACCESS_TOKEN_KEY, access_token, {
        ...cookieConfigsDefault,
      });
    }

    if (refresh_token)
      res.cookie(COOKIE_REFRESH_TOKEN_KEY, refresh_token, cookieConfigsDefault);
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { getRequest, getResponse } = context.switchToHttp();
    const req = getRequest<Request>();
    const res = getResponse<Response>();
    return next.handle().pipe(
      map((data) => {
        this.setTokenToCookie(res, data);
        return data;
      })
    );
  }
}

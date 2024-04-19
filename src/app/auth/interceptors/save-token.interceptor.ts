import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { TokenExpireIn } from 'src/consts/jwt.const';
import { AuthToken } from '../types/token.type';
import { StringUtilService } from 'src/common/utils/string/string-util.service';
import { Request, Response } from 'express';
import {
  COOKIE_ACCESS_TOKEN_KEY,
  COOKIE_REFRESH_TOKEN_KEY,
} from 'src/consts/cookie.const';

@Injectable()
export class SaveTokenInterceptor implements NestInterceptor {
  constructor(private stringService: StringUtilService) {}

  setTokenToCookie(res: Response, data: AuthToken) {
    if (data.access_token)
      res.cookie(COOKIE_ACCESS_TOKEN_KEY, data.access_token, {
        httpOnly: true,
        maxAge: this.stringService.toMS(
          TokenExpireIn.COOKIE_ACCESS_TOKEN_EXPIRE_IN
        ),
      });
    if (data.refresh_token)
      res.cookie(COOKIE_REFRESH_TOKEN_KEY, data.refresh_token, {
        httpOnly: true,
        maxAge: this.stringService.toMS(
          TokenExpireIn.COOKIE_REFRESH_TOKEN_EXPIRE_IN
        ),
      });
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

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
import { ApiService } from 'src/common/utils/api/api.service';
import { HttpHeaders } from 'src/consts/enum.const';

@Injectable()
export class SaveTokenInterceptor implements NestInterceptor {
  constructor(private apiService: ApiService) {}
  setTokenToCookie(res: Response, { access_token, refresh_token }: AuthToken) {
    if (access_token) {
      res.cookie(COOKIE_ACCESS_TOKEN_KEY, access_token, cookieConfigsDefault);
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
        const webpage_key = this.apiService.getHeadersParam({
          key: HttpHeaders.WEBPAGE_KEY,
          headers: req.headers,
        });
        console.log('>>> more', !webpage_key && !req.query?.user_id, data);
        if (!webpage_key && !req.query?.user_id)
          this.setTokenToCookie(res, data);
        return data;
      })
    );
  }
}

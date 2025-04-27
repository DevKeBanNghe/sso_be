import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
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

@Injectable()
export class SaveTokenInterceptor implements NestInterceptor {
  constructor(private apiService: ApiService) {}
  setTokenToCookie(res: Response, { access_token, refresh_token }: AuthToken) {
    if (access_token)
      res.cookie(COOKIE_ACCESS_TOKEN_KEY, access_token, cookieConfigsDefault);

    if (refresh_token)
      res.cookie(COOKIE_REFRESH_TOKEN_KEY, refresh_token, cookieConfigsDefault);

    return res;
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { getRequest, getResponse } = context.switchToHttp();
    const req = getRequest<Request>();
    const res = getResponse<Response>();
    return next.handle().pipe(
      map((data) => {
        try {
          if (data?.access_token || data?.refresh_token)
            this.setTokenToCookie(res, data)
              .status(200)
              .json(
                this.apiService.formatResponse({
                  path: req.path,
                  data,
                })
              );
        } catch (error) {
          Logger.error(error.message, data);
        }
        return data;
      })
    );
  }
}

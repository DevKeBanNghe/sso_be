import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Request } from 'express';
import { ApiService } from '../utils/api/api.service';
import { EnvVars } from 'src/consts/env.const';
import { HttpHeaders } from 'src/consts/enum.const';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private apiService: ApiService,
    private configService: ConfigService
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { getRequest } = context.switchToHttp();
    const req = getRequest<Request>();
    const now = Date.now();
    const requestId = req.headers[HttpHeaders.REQUEST_ID];
    const path = req.path.replace(
      this.configService.get(EnvVars.SERVER_PREFIX),
      ''
    );
    const contextLog = `${context.getClass().name} - ${
      context.getHandler().name
    }`;
    Logger.log({
      message: '',
      context: contextLog,
      path: path,
      payload: JSON.stringify(this.apiService.getPayload(req)),
      requestId,
    });
    return next.handle().pipe(
      map((value) => {
        Logger.log({
          message: '',
          context: contextLog,
          path: path,
          requestId,
          payload: JSON.stringify(value),
          time: `${Date.now() - now}ms`,
        });
        return value;
      })
    );
  }
}

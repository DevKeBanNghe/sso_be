import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Scope,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiService } from '../utils/api/api.service';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class FormatResponseInterceptor implements NestInterceptor {
  constructor(private apiService: ApiService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { getRequest } = context.switchToHttp();
    const req = getRequest<Request>();

    return next.handle().pipe(
      map(async (data) => {
        return this.apiService.formatResponse({
          path: req.path,
          data: data instanceof Promise ? await data : data,
        });
      })
    );
  }
}

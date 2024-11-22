import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { ApiService } from '../utils/api/api.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private apiService: ApiService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { getRequest } = context.switchToHttp();
    const req = getRequest<Request>();

    if (this.apiService.isPathNotAuth(req.originalUrl)) return true;

    return true;
  }
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { KEY_FROM_DECODED_TOKEN } from 'src/consts/jwt.const';
import { ApiService } from '../utils/api/api.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private apiService: ApiService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { getRequest, getResponse } = context.switchToHttp();
    const req = getRequest<Request>();
    const res = getResponse<Response>();

    if (this.apiService.isPathNotAuth(req.originalUrl)) return true;

    if (!req.body[KEY_FROM_DECODED_TOKEN])
      throw new UnauthorizedException(`Token is required`);

    return true;
  }
}

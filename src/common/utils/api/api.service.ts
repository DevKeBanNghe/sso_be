import { HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ApiResponse, FormatPagination } from './api.entity';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/consts';
import {
  PATHS_NOT_AUTH,
  PATHS_NOT_CHECK_PERMISSION,
} from 'src/consts/api.const';
import { IncomingHttpHeaders } from 'http';

@Injectable()
export class ApiService {
  constructor(private configService: ConfigService) {}

  private removeQueryParameters(path: string) {
    const indexQuery = path.indexOf('?');
    if (indexQuery < 0) return path;
    return path.slice(0, indexQuery);
  }
  isPathNotAuth(path: string) {
    path = this.removeQueryParameters(path);
    return PATHS_NOT_AUTH.includes(
      path.replace(this.configService.get(EnvVars.SERVER_PREFIX), '')
    );
  }

  isPathNotCheckPermission(path: string) {
    path = this.removeQueryParameters(path);
    return (
      this.isPathNotAuth(path) ||
      PATHS_NOT_CHECK_PERMISSION.includes(
        path.replace(this.configService.get(EnvVars.SERVER_PREFIX), '')
      )
    );
  }

  getPayload(req: Request) {
    return { ...req.query, ...req.params, ...req.body };
  }

  formatResponse({
    timestamp = new Date().toISOString(),
    path,
    errors = null,
    data = null,
  }: ApiResponse) {
    return {
      timestamp,
      path,
      errors,
      data,
    };
  }

  formatPagination<T>(formatPagination: FormatPagination<T>) {
    return new FormatPagination<T>(formatPagination);
  }

  getBearerToken(headers: IncomingHttpHeaders) {
    const authHeader = headers.authorization;
    if (authHeader?.startsWith('Bearer '))
      return authHeader.substring(7, authHeader.length);
  }
}

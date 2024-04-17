import { HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ApiResponse } from './api.entity';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/consts';
import { PATHS_NOT_AUTH } from 'src/consts/api.const';

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
}

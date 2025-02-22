import { Injectable, RequestMethod } from '@nestjs/common';
import { Request } from 'express';
import { FormatPagination } from './api.entity';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/consts/env.const';
import { PATHS_NOT_AUTH, PATHS_SIGN } from 'src/consts/api.const';
import { IncomingHttpHeaders } from 'http';
import { omit } from 'lodash';
import { FormatResponseParams } from './interfaces/response.interface';

@Injectable()
export class ApiService {
  constructor(private configService: ConfigService) {}

  private removeQueryParameters(path: string) {
    const indexQuery = path.indexOf('?');
    if (indexQuery < 0) return path;
    return path.slice(0, indexQuery);
  }
  isPathNotAuth(path: string) {
    const rootPath = this.removeQueryParameters(path);
    return PATHS_NOT_AUTH.includes(
      rootPath.replace(this.configService.get(EnvVars.SERVER_PREFIX), '')
    );
  }

  getPayload(req: Request) {
    const data = { ...req.query, ...req.params, ...req.body };
    const currentPath = req.path;
    const isSignPath = PATHS_SIGN.some((signPath) =>
      currentPath.includes(signPath)
    );
    return isSignPath
      ? omit(data, ['user_password', 'confirm_password'])
      : data;
  }

  formatResponse({
    timestamp = new Date().toISOString(),
    path = this.configService.get(EnvVars.SERVER_PREFIX),
    errors = null,
    data = null,
    ...params
  }: FormatResponseParams) {
    return {
      timestamp,
      path,
      errors,
      data,
      ...params,
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

  getHttpMethods() {
    return Object.keys(RequestMethod).filter((key) => isNaN(Number(key)));
  }
}

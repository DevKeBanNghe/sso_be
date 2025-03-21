import {
  BadRequestException,
  Inject,
  Injectable,
  RequestMethod,
  Scope,
} from '@nestjs/common';
import { Request } from 'express';
import { FormatPagination } from './api.entity';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/consts/env.const';
import { PATHS_NOT_AUTH, PATHS_SIGN } from 'src/consts/api.const';
import { omit } from 'lodash';
import { FormatResponseParams } from './interfaces/response.interface';
import { HttpHeaders } from 'src/consts/enum.const';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class ApiService {
  constructor(
    private configService: ConfigService,
    @Inject(REQUEST) private req: Request
  ) {}

  private removeQueryParameters(path: string) {
    const indexQuery = path.indexOf('?');
    return indexQuery > 0 ? path.slice(0, indexQuery) : path;
  }

  isPathNotAuth() {
    const rootPath = this.removeQueryParameters(this.req.originalUrl);
    return PATHS_NOT_AUTH.includes(
      rootPath.replace(this.configService.get(EnvVars.SERVER_PREFIX), '')
    );
  }

  getPayload() {
    const req = this.req;
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

  getBearerToken() {
    const authHeader = this.req.headers.authorization;
    if (authHeader?.startsWith('Bearer '))
      return authHeader.substring(7, authHeader.length);
  }

  getHttpMethods() {
    return Object.keys(RequestMethod).filter((key) => isNaN(Number(key)));
  }

  getHeadersParam({ key }: { key: HttpHeaders }) {
    const data = this.req.headers[key] as string;
    if (!data) throw new BadRequestException(`${key} not found in headers`);
    return data;
  }
}

import { BadRequestException, Injectable, RequestMethod } from '@nestjs/common';
import { FormatPagination } from './api.entity';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/consts/env.const';
import { PATHS_NOT_AUTH, PATHS_SIGN } from 'src/consts/api.const';
import { omit } from 'lodash';
import { FormatResponseParams } from './interfaces/response.interface';
import { HttpHeaders } from 'src/consts/enum.const';
import { IncomingHttpHeaders } from 'http';

@Injectable()
export class ApiService {
  constructor(private configService: ConfigService) {}

  private removeQueryParameters(path: string) {
    const indexQuery = path.indexOf('?');
    return indexQuery > 0 ? path.slice(0, indexQuery) : path;
  }

  isPathNotAuth({ originalUrl }) {
    const rootPath = this.removeQueryParameters(originalUrl);
    return PATHS_NOT_AUTH.includes(
      rootPath.replace(this.configService.get(EnvVars.SERVER_PREFIX), '')
    );
  }

  getPayload({ req }) {
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

  getBearerToken({ headers }: { headers: IncomingHttpHeaders }) {
    const authHeader = headers.authorization;
    if (authHeader?.startsWith('Bearer '))
      return authHeader.substring(7, authHeader.length);
  }

  getHttpMethods() {
    return Object.keys(RequestMethod).filter((key) => isNaN(Number(key)));
  }

  getHeadersParam({
    key,
    headers,
  }: {
    key: HttpHeaders;
    headers: IncomingHttpHeaders;
  }) {
    const data = headers[key] as string;
    if (!data) throw new BadRequestException(`${key} not found in headers`);
    return data;
  }
}

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IncomingHttpHeaders } from 'http2';
import { StringUtilService } from '../utils/string/string-util.service';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/consts/env.const';
import { HttpHeaders } from 'src/consts/enum.const';
@Injectable()
export class DefaultParamsMiddleware implements NestMiddleware {
  constructor(
    private stringUtilService: StringUtilService,
    private configService: ConfigService
  ) {}
  private customHeaders(headers: IncomingHttpHeaders) {
    const headersValueCustom = {
      [HttpHeaders.REQUEST_ID]:
        headers[HttpHeaders.REQUEST_ID] ?? this.stringUtilService.random(),
      [HttpHeaders.VERSION]:
        headers[HttpHeaders.VERSION] ??
        this.configService.get(EnvVars.API_VERSION),
    };

    const data = Object.entries(headersValueCustom).reduce(
      (acc, [key, value]) => {
        acc[key] = value;
        return acc;
      },
      structuredClone(headers)
    );
    return data;
  }
  use(req: Request, res: Response, next: NextFunction) {
    const headersCustom = this.customHeaders(req.headers);
    req.headers = headersCustom;
    next();
  }
}

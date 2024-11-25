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
  private setHeaders(headers: IncomingHttpHeaders) {
    const instance = {
      [HttpHeaders.REQUEST_ID]:
        headers[HttpHeaders.REQUEST_ID] ?? this.stringUtilService.genRandom(),
      [HttpHeaders.VERSION]:
        headers[HttpHeaders.VERSION] ??
        this.configService.get(EnvVars.API_VERSION),
    };
    for (const [key, value] of Object.entries(instance)) {
      headers[key] = value;
    }
  }
  use(req: Request, res: Response, next: NextFunction) {
    this.setHeaders(req.headers);
    next();
  }
}

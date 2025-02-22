import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpHeaders } from 'src/consts/enum.const';
import { ApiService } from '../utils/api/api.service';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorsInfo, ErrorsResponse } from './interfaces/errors.interface';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private apiService: ApiService
  ) {}
  private getErrorContext(exception: Error) {
    const stackLine = exception.stack?.split('\n')[1];
    const functionMatch = stackLine?.match(/at (\S+)/);
    const funcPath = functionMatch ? functionMatch[1] : 'Anonymous';
    return { funcPath, className: funcPath.split('.')[0] };
  }

  getMessagesError(errors) {
    if (typeof errors === 'string') return [errors];
    return Array.isArray(errors.message) ? errors.message : [errors.message];
  }

  catch(exception: any, host: ArgumentsHost) {
    try {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const { httpAdapter } = this.httpAdapterHost;

      const { funcPath, className } = this.getErrorContext(exception);
      const path = httpAdapter.getRequestUrl(request);
      const status =
        exception.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;

      let errorsInfo: ErrorsInfo = {
        message: exception.message,
        funcPath,
        ...(exception.getResponse?.() ?? {}),
      };
      const messasgeErrors = this.getMessagesError(errorsInfo);
      const errorsResponse: ErrorsResponse = {
        path,
        errors: messasgeErrors,
      };

      const hostType = host.getType();
      if (hostType === 'http') {
        if (status === HttpStatus.UNAUTHORIZED && exception.expiredAt) {
          errorsInfo = {
            ...errorsInfo,
            expiredAt: exception.expiredAt,
          };
        }
      }

      Logger.error({
        path,
        requestId: request.headers[HttpHeaders.REQUEST_ID],
        payload: JSON.stringify(this.apiService.getPayload(request)),
        errors: JSON.stringify(errorsInfo),
        message: `[${className}]`,
      });

      httpAdapter.reply(
        response,
        this.apiService.formatResponse(errorsResponse),
        status
      );
    } catch (error) {
      Logger.error(error);
    }
  }
}

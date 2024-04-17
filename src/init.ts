import { INestApplication, VersioningType } from '@nestjs/common';
import compression from 'compression';
import cookieParser from 'cookie-parser';
// eslint-disable-next-line @nx/enforce-module-boundaries
import useragent from 'express-useragent';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { AuthGuard } from './common/guards/auth.guard';
import { EnvVars, HttpHeaders } from './consts';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { DefaultParamsMiddleware } from './common/middlewares/default-params.middleware';
import { ConfigService } from '@nestjs/config';
import { initSwagger } from './confs/swagger.confs';
import { helmetMiddleware } from './confs/middlewares.confs';
import { FormatResponseInterceptor } from './common/interceptors/format-response.interceptor';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { ApiService } from './common/utils/api/api.service';
import { HttpAdapterHost } from '@nestjs/core';

export const initApp = async (app: INestApplication) => {
  const configService = app.get(ConfigService);
  const { white_list } = configService.get(EnvVars.ENV_LAZY_LOAD);
  app.setGlobalPrefix(configService.get(EnvVars.SERVER_PREFIX));
  app.use(helmetMiddleware, compression(), cookieParser(), useragent.express());
  app.use(DefaultParamsMiddleware);
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: HttpHeaders.VERSION,
    defaultVersion: configService.get(EnvVars.API_VERSION),
  });
  app.enableCors({
    origin: white_list,
    credentials: true,
  });
  const apiService = app.get(ApiService);
  app.useGlobalGuards(new AuthGuard(apiService));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new FormatResponseInterceptor(apiService),
    new LoggingInterceptor(apiService, configService)
  );
  app.useGlobalFilters(
    new AllExceptionFilter(app.get(HttpAdapterHost), apiService)
  );
  app = initSwagger(app);

  return app;
};

import { INestApplication, VersioningType } from '@nestjs/common';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { AuthGuard } from './common/guards/auth.guard';
import { EnvVars, HttpHeaders } from './consts';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ConfigService } from '@nestjs/config';
import { initSwagger } from './confs/swagger.confs';
import { FormatResponseInterceptor } from './common/interceptors/format-response.interceptor';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { ApiService } from './common/utils/api/api.service';
import { HttpAdapterHost } from '@nestjs/core';
import { AccessControlGuard } from './common/guards/access-control.guard';
import { ParseParamsOptionPipe } from './common/pipes/parse-params-option.pipe';
import { UserService } from './app/user/user.service';
import { WebpageService } from './app/webpage/webpage.service';

export const initApp = async (app: INestApplication) => {
  const configService = app.get(ConfigService);
  app.setGlobalPrefix(configService.get(EnvVars.SERVER_PREFIX));
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: HttpHeaders.VERSION,
    defaultVersion: configService.get(EnvVars.API_VERSION),
  });
  const webpage_allowed = await app.get(WebpageService).getWhiteList();
  app.enableCors({
    origin: [configService.get(EnvVars.FE_URL), ...webpage_allowed],
    credentials: true,
  });
  const apiService = app.get(ApiService);
  app.useGlobalGuards(
    new AuthGuard(apiService),
    new AccessControlGuard(configService, app.get(UserService), apiService)
  );
  app.useGlobalPipes(new ValidationPipe(), new ParseParamsOptionPipe());
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

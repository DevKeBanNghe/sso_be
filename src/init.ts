import { INestApplication, VersioningType } from '@nestjs/common';
import { EnvVars } from './consts/env.const';
import { HttpHeaders } from './consts/enum.const';
import { ConfigService } from '@nestjs/config';
import { initSwagger } from './confs/swagger.confs';
import { WebpageService } from './app/webpage/webpage.service';

export const initApp = async (app: INestApplication) => {
  const configService = app.get(ConfigService);
  app.setGlobalPrefix(configService.get(EnvVars.SERVER_PREFIX));
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: HttpHeaders.VERSION,
    defaultVersion: configService.get(EnvVars.API_VERSION),
  });

  const webpageService = app.get(WebpageService);
  // const webpageRegisted = await webpageService.getWhiteList();
  app.enableCors({
    origin: [configService.get(EnvVars.FE_URL)],
    credentials: true,
  });

  const isDevelopment = configService.get(EnvVars.NODE_ENV) === 'development';
  if (isDevelopment) app = initSwagger(app);
  return app;
};

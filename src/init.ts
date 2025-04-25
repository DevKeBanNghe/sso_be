import { INestApplication, Logger, VersioningType } from '@nestjs/common';
import { EnvVars } from './consts/env.const';
import { Environments, HttpHeaders } from './consts/enum.const';
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

  try {
    const webpageService = await app.resolve(WebpageService);
    const webpageRegisted = await webpageService.getWhiteList();
    app.enableCors({
      origin: [
        configService.get(EnvVars.FE_URL),
        ...webpageRegisted,
        'https://blog-be-9lwn.onrender.com',
      ],
      credentials: true,
    });
  } catch (error) {
    Logger.error({
      message: error.message,
      context: 'InitApp',
    });
    process.exit(1);
  }

  const isDevelopment =
    configService.get(EnvVars.NODE_ENV) === Environments.DEVELOPMENT;
  if (isDevelopment) app = initSwagger(app);

  return app;
};

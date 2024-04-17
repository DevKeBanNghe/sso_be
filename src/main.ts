import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { initApp } from './init';
import { LoggerCustom } from './confs/logger.confs';
import { EnvVars } from './consts';

async function bootstrap() {
  let app = await NestFactory.create(AppModule, {
    logger: LoggerCustom,
  });
  const configService = app.get(ConfigService);
  app = await initApp(app);
  await app.listen(configService.get(EnvVars.PORT));
  Logger.log(
    `🚀 Application is running on: ${configService.get(
      EnvVars.APP_URL
    )} (${configService.get(EnvVars.NODE_ENV)})`
  );
}

bootstrap();

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvs, validationSchema } from 'src/confs/env.confs';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { EnvVars } from 'src/consts';
import { AuthModule } from './auth/auth.module';
import { DeviceModule } from './device/device.module';
import { ApiModule } from 'src/common/utils/api/api.module';
import { StringModule } from 'src/common/utils/string/string.module';
import { DecodedTokenMiddleware } from 'src/common/middlewares/decoded-token.middleware';
import { SaveTokenInterceptor } from './auth/interceptors/save-token.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      expandVariables: true,
      load: [getEnvs],
      validationSchema,
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get(EnvVars.THROTTLE_TTL),
          limit: config.get(EnvVars.THROTTLE_LIMIT),
        },
      ],
    }),
    UserModule,
    AuthModule,
    DeviceModule,
    ApiModule,
    StringModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService,
    SaveTokenInterceptor,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DecodedTokenMiddleware).forRoutes('*'); // Áp dụng middleware cho tất cả các route
  }
}

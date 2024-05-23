import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from 'src/confs/env.confs';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { WinstonEnvs } from 'src/consts';
import { AuthModule } from './auth/auth.module';
import { DeviceModule } from './device/device.module';
import { ApiModule } from 'src/common/utils/api/api.module';
import { StringUtilModule } from 'src/common/utils/string/string-util.module';
import { DecodedTokenMiddleware } from 'src/common/middlewares/decoded-token.middleware';
import { SaveTokenInterceptor } from './auth/interceptors/save-token.interceptor';
import { DefaultParamsMiddleware } from 'src/common/middlewares/default-params.middleware';
import { applyOtherMiddlewares } from 'src/common/middlewares';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { PrismaModule } from 'src/common/db/prisma/prisma.module';
import { WebpageModule } from './webpage/webpage.module';
import { RolePermissionModule } from './role-permission/role-permission.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      expandVariables: true,
      validationSchema,
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get(WinstonEnvs.THROTTLE_TTL),
          limit: config.get(WinstonEnvs.THROTTLE_LIMIT),
        },
      ],
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    DeviceModule,
    ApiModule,
    StringUtilModule,
    RoleModule,
    PermissionModule,
    RolePermissionModule,
    WebpageModule,
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
    applyOtherMiddlewares(consumer);
    consumer
      .apply(DefaultParamsMiddleware, DecodedTokenMiddleware)
      .forRoutes('*');
  }
}

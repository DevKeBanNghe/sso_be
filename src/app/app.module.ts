import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from 'src/confs/env.confs';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { MailEnvs, WinstonEnvs } from 'src/consts/env.const';
import { AuthModule } from './auth/auth.module';
import { DeviceModule } from './device/device.module';
import { ApiModule } from 'src/common/utils/api/api.module';
import { SaveTokenInterceptor } from './auth/interceptors/save-token.interceptor';
import { applyMiddlewares } from 'src/common/middlewares';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { PrismaModule } from 'src/common/db/prisma/prisma.module';
import { WebpageModule } from './webpage/webpage.module';
import { RolePermissionModule } from './role-permission/role-permission.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { MailTemplate } from 'src/consts/mail.const';
import { StringUtilModule } from 'src/common/utils/string/string-util.module';
import { AccessControlGuard } from 'src/common/guards/access-control/access-control.guard';
import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptor';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { UserRoleModule } from './user-role/user-role.module';
import { CaslAbilityModule } from '../common/guards/access-control/casl/casl-ability.module';
import { QueryUtilModule } from 'src/common/utils/query/query-util.module';
import { ExcelUtilModule } from 'src/common/utils/excel/excel-util.module';
import { FileUtilModule } from 'src/common/utils/file/file-util.module';
import { AllExceptionFilter } from 'src/common/filters/all-exception.filter';
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
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get(MailEnvs.MAIL_HOST),
          port: configService.get(MailEnvs.MAIL_PORT),
          ignoreTLS: false,
          secure: false,
          auth: {
            user: configService.get(MailEnvs.MAIL_INCOMING_USER),
            pass: configService.get(MailEnvs.MAIL_INCOMING_PASS),
          },
        },
        defaults: {
          from: `"${MailTemplate.MAIL_NAME_DEFAULT}" <${MailTemplate.MAIL_DEFAULT}>`,
        },
        template: {
          dir: __dirname + MailTemplate.TEMPLATES_PATH,
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    FileUtilModule,
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
    UserRoleModule,
    CaslAbilityModule,
    QueryUtilModule,
    ExcelUtilModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SaveTokenInterceptor,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AccessControlGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: FormatResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    applyMiddlewares(consumer);
  }
}

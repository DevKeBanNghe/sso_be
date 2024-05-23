import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { MailEnvs, EnvVars } from 'src/consts';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenExpireIn } from 'src/consts/jwt.const';
import { ApiModule } from 'src/common/utils/api/api.module';
import { StringUtilService } from 'src/common/utils/string/string-util.service';
import { GoogleStrategy } from './strategies/google-oauth2.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { GithubStrategy } from './strategies/github.strategy';
import { WebpageService } from '../webpage/webpage.service';
import { SaveTokenInterceptor } from './interceptors/save-token.interceptor';
import { WebpageModule } from '../webpage/webpage.module';
@Module({
  imports: [
    UserModule,
    ApiModule,
    ConfigModule,
    WebpageModule,
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
          from: '"Dev Kể Bạn Nghe" <devkebannghe@gmail.com>',
        },
        template: {
          dir: __dirname + '/templates/mails',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get(EnvVars.JWT_SECRET_KEY),
        signOptions: {
          expiresIn: TokenExpireIn.ACCESS_TOKEN_EXPIRE_IN,
          noTimestamp: true,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    StringUtilService,
    GoogleStrategy,
    ConfigService,
    GithubStrategy,
    SaveTokenInterceptor,
  ],
  exports: [AuthService],
})
export class AuthModule {}

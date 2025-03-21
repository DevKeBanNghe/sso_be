import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { EnvVars } from 'src/consts/env.const';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenExpireIn } from 'src/consts/jwt.const';
import { ApiModule } from 'src/common/utils/api/api.module';
import { StringUtilService } from 'src/common/utils/string/string-util.service';
import { GoogleStrategy } from './strategies/google-oauth2.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { SaveTokenInterceptor } from './interceptors/save-token.interceptor';
import { WebpageModule } from '../webpage/webpage.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    ApiModule,
    ConfigModule,
    WebpageModule,
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
    // FacebookStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}

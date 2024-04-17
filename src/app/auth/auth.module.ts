import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { EnvVars } from 'src/consts';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenExpireIn } from 'src/consts/jwt.const';
import { ApiModule } from 'src/common/utils/api/api.module';
import { StringService } from 'src/common/utils/string/string.service';
import { GoogleStrategy } from './strategies/google-oauth2.strategy';

@Module({
  imports: [
    UserModule,
    ApiModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get(EnvVars.JWT_SECRET_KEY),
        signOptions: {
          expiresIn: TokenExpireIn.ACCESS_TOKEN_EXPIRE_IN,
          noTimestamp: true,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, StringService, GoogleStrategy, ConfigService],
  exports: [AuthService],
})
export class AuthModule {}

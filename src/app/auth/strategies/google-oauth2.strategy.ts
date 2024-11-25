import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVars, GoogleEnvs } from 'src/consts/env.const';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get(GoogleEnvs.GOOGLE_OAUTH2_CLIENT_ID),
      clientSecret: configService.get(GoogleEnvs.GOOGLE_OAUTH2_CLIENT_SECRET),
      callbackURL: `${configService.get(EnvVars.APP_URL)}/auth/google-redirect`,
      scope: ['email', 'profile'],
    });
  }
  async validate(
    access_token: string,
    refresh_token: string,
    profile: any,
    done: VerifyCallback
  ): Promise<any> {
    const {
      given_name: first_name,
      family_name: last_name,
      ...payload
    } = profile._json;
    const user = {
      first_name,
      last_name,
      ...payload,
      access_token,
      refresh_token,
    };
    done(null, user);
  }
}

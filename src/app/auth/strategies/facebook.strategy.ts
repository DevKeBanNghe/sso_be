import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVars, FacebookEnvs } from 'src/consts';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get(FacebookEnvs.FACEBOOK_CLIENT_ID),
      clientSecret: configService.get(FacebookEnvs.FACEBOOK_CLIENT_SECRET),
      callbackURL: `${configService.get(
        EnvVars.APP_URL
      )}/auth/facebook-redirect`,
      scope: 'email',
      profileFields: ['emails', 'displayName', 'name', 'photos'],
    });
  }

  async validate(
    access_token: string,
    refresh_token: string,
    profile: Profile,
    done: (err?: Error | null, profile?: any) => void
  ) {
    const { first_name, last_name, ...payload } = profile._json;
    const user = {
      first_name,
      last_name,
      user_name: `${first_name} ${last_name}`,
      ...payload,
      access_token,
      refresh_token,
    };
    done(null, user);
  }
}

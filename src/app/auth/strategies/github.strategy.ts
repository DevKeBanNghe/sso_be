import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GithubEnvs } from 'src/consts/env.const';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get(GithubEnvs.GITHUB_CLIENT_ID),
      clientSecret: configService.get(GithubEnvs.GITHUB_CLIENT_SECRET),
      scope: ['user:email'],
    });
  }

  async validate(
    access_token: string,
    refresh_token: string,
    profile: any,
    done: (err?: Error | null, profile?: any) => void
  ) {
    const { name, login, ...payload } = profile._json;
    const user_name = name ?? login;
    const indexFirstSpaceName = user_name.indexOf(' ');
    const user = {
      first_name:
        indexFirstSpaceName >= 0 ? name.slice(0, indexFirstSpaceName) : null,
      last_name:
        indexFirstSpaceName >= 0 ? name.slice(indexFirstSpaceName + 1) : null,
      user_name,
      ...payload,
      access_token,
      refresh_token,
    };
    done(null, user);
  }
}

import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GithubEnvs } from 'src/consts';

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
    const { name, login: user_name, ...payload } = profile._json;
    const indexFirstSpaceName = name.indexOf(' ');
    const user = {
      first_name: name.slice(0, indexFirstSpaceName),
      last_name: name.slice(indexFirstSpaceName + 1),
      user_name,
      ...payload,
      access_token,
      refresh_token,
    };
    done(null, user);
  }
}

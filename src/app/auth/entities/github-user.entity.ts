import { SocialSignIn } from './auth.entity';

export class GithubUser extends SocialSignIn {
  avatar_url: string;
}

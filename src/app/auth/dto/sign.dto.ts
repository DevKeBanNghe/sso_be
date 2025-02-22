import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { Auth } from '../entities/auth.entity';
import { User } from 'src/app/user/entities/user.entity';
import { Webpage } from 'src/app/webpage/entities/webpage.entity';
import { GoogleUser } from '../entities/google-user.entity';
import { GithubUser } from '../entities/github-user.entity';
import { FacebookUser } from '../entities/facebook-user.entity';
import { Response } from 'express';

export class SignInDto extends IntersectionType(
  PickType(Auth, ['user_name']),
  PartialType(Auth),
  PartialType(PickType(User, ['user_type_login'])),
  PickType(PartialType(Webpage), ['webpage_key'])
) {}

export class SignUpDto extends IntersectionType(
  PickType(Auth, ['user_email', 'user_name']),
  PartialType(Auth),
  PartialType(User),
  PickType(User, ['created_by'])
) {}

export class GoogleUserDto extends GoogleUser {}

export class GithubUserDto extends GithubUser {}
export class FacebookUserDto extends FacebookUser {}
export class SocialsSignDto extends PickType(Webpage, ['webpage_key']) {
  res: Response;
}

export class handleSignUpSocialsParams extends PickType(Webpage, [
  'webpage_key',
]) {
  type?: User['user_type_login'];
  data;
}

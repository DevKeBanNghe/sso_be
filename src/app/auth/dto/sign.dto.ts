import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { Auth } from '../entities/auth.entity';
import { TypeLogin, User } from 'src/app/user/entities/user.entity';

export class SignInDto extends IntersectionType(
  PickType(Auth, ['user_name', 'password']),
  PartialType(Auth)
) {}

export class SignInSocialDto extends IntersectionType(
  PickType(Auth, ['user_name']),
  PartialType(Auth),
  PartialType(User)
) {}

export class SignUpDto extends IntersectionType(
  PickType(Auth, ['email', 'user_name', 'password']),
  PartialType(Auth),
  PartialType(User)
) {
  user_type_login: TypeLogin = TypeLogin.ACCOUNT;
}

import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { Auth } from '../entities/auth.entity';
import { User } from 'src/app/user/entities/user.entity';

export class SignInDto extends IntersectionType(
  PickType(Auth, ['user_name']),
  PartialType(Auth),
  PartialType(PickType(User, ['user_type_login']))
) {}

export class SignUpDto extends IntersectionType(
  PickType(Auth, ['email', 'user_name']),
  PartialType(Auth),
  PartialType(User)
) {}

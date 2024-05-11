import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { Auth } from '../entities/auth.entity';
import { User } from 'src/app/user/entities/user.entity';
import { Webpage } from 'src/app/webpage/entities/webpage.entity';

export class SignInDto extends IntersectionType(
  PickType(Auth, ['user_name']),
  PartialType(Auth),
  PartialType(PickType(User, ['user_type_login'])),
  PickType(PartialType(Webpage), ['webpage_key'])
) {}

export class SignUpDto extends IntersectionType(
  PickType(Auth, ['email', 'user_name']),
  PartialType(Auth),
  PartialType(User)
) {}

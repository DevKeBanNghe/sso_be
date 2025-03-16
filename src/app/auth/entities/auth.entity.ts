import { PickType } from '@nestjs/mapped-types';
import { User } from '@prisma-postgresql/models';

export class Auth extends PickType(User, [
  'user_name',
  'user_email',
  'user_password',
  'user_phone_number',
  'user_date_of_birth',
]) {}

export class SocialSignIn extends PickType(Auth, ['user_name']) {
  email: string;
  first_name: string;
  last_name: string;
  access_token: string;
  refresh_token: string;
}

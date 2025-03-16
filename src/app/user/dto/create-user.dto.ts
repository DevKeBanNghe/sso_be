import { OmitType, PickType, IntersectionType } from '@nestjs/mapped-types';
import { User } from '@prisma-postgresql/models';
import { TRACKING_MODEL_FIELDS } from 'src/consts/model.const';

class UserOption extends OmitType(User, [
  'devices',
  'roles',
  'user_id',
  'is_supper_admin',
  'user_type_login',
  ...TRACKING_MODEL_FIELDS,
]) {}

class UserRequired extends PickType(User, ['user_email', 'user_name']) {}

export class CreateUserDto extends IntersectionType(UserOption, UserRequired) {}

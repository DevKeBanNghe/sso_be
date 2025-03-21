import {
  OmitType,
  PickType,
  IntersectionType,
  PartialType,
} from '@nestjs/mapped-types';
import { User, Webpage } from '@prisma-postgresql/models';
import { TRACKING_MODEL_FIELDS } from 'src/consts/model.const';

class UserOption extends OmitType(User, [
  'devices',
  'roles',
  'webpages',
  'user_id',
  'is_supper_admin',
  'user_type_login',
  ...TRACKING_MODEL_FIELDS,
]) {}

class CreateUserDto extends IntersectionType(
  UserOption,
  PickType(User, ['user_email', 'user_name'])
) {}

class CreateUsersSubscribeWebpageDto extends IntersectionType(
  PickType(User, ['user_email']),
  PartialType(PickType(Webpage, ['webpage_key']))
) {}

export { CreateUserDto, CreateUsersSubscribeWebpageDto };

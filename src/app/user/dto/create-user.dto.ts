import {
  OmitType,
  PartialType,
  PickType,
  IntersectionType,
} from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

class UserOption extends PartialType(
  OmitType(User, ['Device', 'user_id', 'created_at', 'updated_at'] as const)
) {}

class UserRequired extends PickType(User, [
  'user_email',
  'user_name',
  'created_by',
]) {}

export class CreateUserDto extends IntersectionType(UserOption, UserRequired) {}

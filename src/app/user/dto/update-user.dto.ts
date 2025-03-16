import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { User } from '@prisma-postgresql/models';

export class UpdateUserDto extends IntersectionType(
  PickType(User, ['user_id']),
  PartialType(CreateUserDto)
) {}

export class UpdateActivateStatusDto extends IntersectionType(
  PickType(User, ['is_active'])
) {
  user_ids: User['user_id'][];
}

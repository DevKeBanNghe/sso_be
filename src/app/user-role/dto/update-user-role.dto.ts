import { PickType } from '@nestjs/mapped-types';
import { User, Role } from '@prisma-postgresql/models';

export class UpdateUserRoleDto extends PickType(User, ['user_id']) {
  role_ids: Role['role_id'][];
}

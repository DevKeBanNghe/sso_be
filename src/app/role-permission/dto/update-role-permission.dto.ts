import { PickType } from '@nestjs/mapped-types';
import { Permission, Role } from '@prisma-postgresql/models';

export class UpdateRolePermissionDto extends PickType(Permission, [
  'permission_id',
]) {
  role_ids: Role['role_id'][];
}

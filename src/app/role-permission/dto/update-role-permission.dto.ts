import { PickType } from '@nestjs/mapped-types';
import { Permission } from 'src/app/permission/entities/permission.entity';
import { Role } from 'src/app/role/entities/role.entity';

export class UpdateRolePermissionDto extends PickType(Permission, [
  'permission_id',
]) {
  role_ids: Role['role_id'][];
}

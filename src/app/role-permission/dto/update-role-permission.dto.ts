import { PickType } from '@nestjs/mapped-types';
import { Permission } from 'src/app/permission/entities/permission.entity';

export class UpdateRolePermissionDto extends PickType(Permission, [
  'permission_id',
]) {
  role_ids: number[];
}

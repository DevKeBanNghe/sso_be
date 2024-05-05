import { PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './create-permission.dto';
import { PickType } from '@nestjs/mapped-types';
import { Permission } from '../entities/permission.entity';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}
export class UpdateGroupPermissionDto extends PickType(Permission, [
  'group_permission_id',
]) {
  permission_ids: number[];
}

import { PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './create-permission.dto';
import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { Permission } from '@prisma-postgresql/models';

export class UpdatePermissionDto extends IntersectionType(
  PartialType(CreatePermissionDto),
  PickType(Permission, ['permission_id'])
) {}

export class UpdateActivateStatusDto extends IntersectionType(
  PickType(Permission, ['is_active'])
) {
  permission_ids: Permission['permission_id'][];
}

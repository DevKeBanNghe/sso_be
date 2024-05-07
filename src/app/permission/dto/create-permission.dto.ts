import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { Permission } from '../entities/permission.entity';

export class CreatePermissionDto extends IntersectionType(
  PickType(Permission, [
    'permission_name',
    'permission_key',
    'permission_router',
  ]),
  PartialType(Permission)
) {}

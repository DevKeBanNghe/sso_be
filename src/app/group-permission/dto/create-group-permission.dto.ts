import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { GroupPermission } from '../entities/group-permission.entity';

export class CreateGroupPermissionDto extends IntersectionType(
  PickType(GroupPermission, ['group_permission_name']),
  PartialType(GroupPermission)
) {
  permission_ids?: number[];
}

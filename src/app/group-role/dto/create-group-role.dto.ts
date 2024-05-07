import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { GroupRole } from '../entities/group-role.entity';

export class CreateGroupRoleDto extends IntersectionType(
  PickType(GroupRole, ['group_role_name', 'webpage_id']),
  PartialType(GroupRole)
) {
  group_permission_ids: number[];
  role_ids: number[];
}

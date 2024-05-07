import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { Role } from '../entities/role.entity';
import { CreateRoleDto } from './create-group-role.dto';
import { GroupRole } from 'src/app/group-role/entities/group-role.entity';

export class UpdateRoleDto extends IntersectionType(
  PickType(Role, ['role_id']),
  PartialType(CreateRoleDto)
) {}

export class UpdateGroupRoleDto extends PickType(GroupRole, ['group_role_id']) {
  role_ids: number[];
}

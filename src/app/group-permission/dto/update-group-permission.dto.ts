import { PartialType } from '@nestjs/swagger';
import { CreateGroupPermissionDto } from './create-group-permission.dto';
import { PickType } from '@nestjs/mapped-types';
import { GroupRole } from 'src/app/group-role/entities/group-role.entity';

export class UpdateGroupPermissionDto extends PartialType(
  CreateGroupPermissionDto
) {}

export class UpdateGroupRoleDto extends PickType(GroupRole, ['group_role_id']) {
  group_permission_ids: number[];
}

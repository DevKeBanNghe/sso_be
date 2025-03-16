import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { Role, Webpage } from '@prisma-postgresql/models';

export class UpdateRoleDto extends IntersectionType(
  PickType(Role, ['role_id']),
  PartialType(CreateRoleDto)
) {}

export class UpdateWebpageDto extends IntersectionType(
  PickType(Webpage, ['webpage_id'])
) {
  role_ids: Role['role_id'][];
}

export class UpdateActivateStatusDto extends IntersectionType(
  PickType(Role, ['is_active'])
) {
  role_ids: Role['role_id'][];
}

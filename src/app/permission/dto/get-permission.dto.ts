import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { PaginationList } from 'src/common/classes/pagination-list.class';
import { OptionParams } from 'src/common/classes/option.class';
import { Permission, Webpage, User } from '@prisma-postgresql/models';

export class GetPermissionsByRoleDto extends IntersectionType(
  PickType(User, ['roles']),
  PickType(Webpage, ['webpage_url'])
) {}

export class GetPermissionListByPaginationDto extends IntersectionType(
  PaginationList,
  PartialType(Permission)
) {}

export class GetPermissionOptionsDto extends IntersectionType(
  OptionParams,
  PartialType(Permission)
) {
  role_ids: string;
}

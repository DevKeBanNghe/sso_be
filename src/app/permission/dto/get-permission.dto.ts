import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { PaginationList } from 'src/common/classes/pagination-list.class';
import { OptionParams } from 'src/common/classes/option.class';
import { Permission, Webpage, User } from '@prisma-postgresql/models';

class GetPermissionsByRoleDto extends IntersectionType(
  PickType(User, ['roles']),
  PickType(Webpage, ['webpage_url'])
) {}

class GetPermissionListByPaginationDto extends IntersectionType(
  PaginationList,
  PartialType(Permission)
) {}

class GetPermissionOptionsDto extends IntersectionType(
  OptionParams,
  PartialType(Permission)
) {
  role_ids: string;
}

class ExportPermissionsDto {
  ids: Permission['permission_id'][];
}

export {
  GetPermissionsByRoleDto,
  GetPermissionListByPaginationDto,
  GetPermissionOptionsDto,
  ExportPermissionsDto,
};

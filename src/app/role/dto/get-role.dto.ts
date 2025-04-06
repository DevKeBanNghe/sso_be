import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { PaginationList } from 'src/common/classes/pagination-list.class';
import { OptionParams } from 'src/common/classes/option.class';
import { Role } from '@prisma-postgresql/models';

class GetRoleListByPaginationDto extends IntersectionType(
  PaginationList,
  PartialType(Role)
) {}

class GetRoleOptionsDto extends IntersectionType(
  OptionParams,
  PartialType(Role),
  PartialType(PickType(PaginationList, ['search']))
) {}

class GetRoleDetailDto extends PickType(Role, ['role_id']) {}
class DeleteRoleDetailDto extends PickType(Role, ['role_id']) {}

class ExportRolesDto {
  ids: Role['role_id'][];
}

export {
  GetRoleListByPaginationDto,
  GetRoleOptionsDto,
  GetRoleDetailDto,
  DeleteRoleDetailDto,
  ExportRolesDto,
};

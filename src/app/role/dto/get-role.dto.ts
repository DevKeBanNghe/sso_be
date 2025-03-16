import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { PaginationList } from 'src/common/classes/pagination-list.class';
import { OptionParams } from 'src/common/classes/option.class';
import { Role } from '@prisma-postgresql/models';

export class GetRoleListByPaginationDto extends IntersectionType(
  PaginationList,
  PartialType(Role)
) {}

export class GetRoleOptionsDto extends IntersectionType(
  OptionParams,
  PartialType(Role),
  PartialType(PickType(PaginationList, ['search']))
) {}

export class GetRoleDetailDto extends PickType(Role, ['role_id']) {}
export class DeleteRoleDetailDto extends PickType(Role, ['role_id']) {}

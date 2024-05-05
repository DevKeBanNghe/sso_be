import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { GroupRole } from '../entities/group-role.entity';
import { OptionParams } from 'src/common/classes/option.class';
import { PaginationList } from 'src/common/classes/pagination-list.class';

export class GetGroupRoleOptionsDto extends IntersectionType(
  OptionParams,
  PartialType(GroupRole)
) {}

export class GetGroupRoleListByPaginationDto extends IntersectionType(
  PaginationList,
  PartialType(GroupRole)
) {}

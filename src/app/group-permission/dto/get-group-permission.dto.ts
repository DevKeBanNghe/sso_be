import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { GroupPermission } from '../entities/group-permission.entity';
import { OptionParams } from 'src/common/classes/option.class';
import { PaginationList } from 'src/common/classes/pagination-list.class';

export class GetGroupPermissionOptionsDto extends IntersectionType(
  OptionParams,
  PartialType(GroupPermission)
) {}

export class GetGroupPermissionListByPaginationDto extends IntersectionType(
  PaginationList,
  PartialType(GroupPermission)
) {}

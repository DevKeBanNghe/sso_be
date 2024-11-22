import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { PaginationList } from 'src/common/classes/pagination-list.class';
import { Role } from '../entities/role.entity';
import { OptionParams } from 'src/common/classes/option.class';

export class GetRoleListByPaginationDto extends IntersectionType(
  PaginationList,
  PartialType(Role)
) {}

export class GetRoleOptionsDto extends IntersectionType(
  OptionParams,
  PartialType(Role)
) {}

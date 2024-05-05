import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { User } from 'src/app/user/entities/user.entity';
import { PaginationList } from 'src/common/classes/pagination-list.class';
import { Permission } from '../entities/permission.entity';
import { Webpage } from 'src/app/webpage/entities/webpage.entity';
import { OptionParams } from 'src/common/classes/option.class';

export class GetPermissionsByRoleDto extends IntersectionType(
  PickType(User, ['role_id']),
  PickType(Webpage, ['webpage_url'])
) {}

export class GetPermissionListByPaginationDto extends IntersectionType(
  PaginationList,
  PartialType(Permission)
) {}

export class GetPermissionOptionsDto extends IntersectionType(
  OptionParams,
  PartialType(Permission)
) {}

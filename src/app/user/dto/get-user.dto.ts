import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { PaginationList } from 'src/common/classes/pagination-list.class';
import { User } from '../entities/user.entity';

export class GetUserListByPaginationDto extends IntersectionType(
  PaginationList,
  PartialType(User)
) {}

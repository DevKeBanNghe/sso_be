import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { Webpage } from '../entities/webpage.entity';
import { PaginationList } from 'src/common/classes/pagination-list.class';

export class GetWebpageListByPaginationDto extends IntersectionType(
  PaginationList,
  PartialType(Webpage)
) {}

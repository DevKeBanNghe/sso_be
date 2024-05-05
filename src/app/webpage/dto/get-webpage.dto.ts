import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { Webpage } from '../entities/webpage.entity';
import { OptionParams } from 'src/common/classes/option.class';
import { PaginationList } from 'src/common/classes/pagination-list.class';

export class GetWebpageOptionsDto extends IntersectionType(
  OptionParams,
  PartialType(Webpage)
) {}

export class GetWebpageListByPaginationDto extends IntersectionType(
  PaginationList,
  PartialType(Webpage)
) {}

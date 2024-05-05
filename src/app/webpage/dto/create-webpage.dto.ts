import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { Webpage } from '../entities/webpage.entity';

export class CreateWebpageDto extends IntersectionType(
  PickType(Webpage, ['webpage_url', 'webpage_id']),
  PartialType(Webpage)
) {}

import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { Webpage } from '../entities/webpage.entity';

export class CreateWebpageDto extends IntersectionType(
  PartialType(PickType(Webpage, ['webpage_description', 'webpage_id'])),
  Webpage
) {
  role_ids: number[];
}

import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { CreateWebpageDto } from './create-webpage.dto';
import { Webpage } from '@prisma-postgresql/models';

export class UpdateWebpageDto extends IntersectionType(
  CreateWebpageDto,
  PickType(Webpage, ['webpage_id'])
) {}

export class UpdateActivateStatusDto extends IntersectionType(
  PickType(Webpage, ['is_active'])
) {
  webpage_ids: Webpage['webpage_id'][];
}

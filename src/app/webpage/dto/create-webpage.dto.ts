import { OmitType } from '@nestjs/mapped-types';
import { Webpage, Role } from '@prisma-postgresql/models';
import { TRACKING_MODEL_FIELDS } from 'src/consts/model.const';

export class CreateWebpageDto extends OmitType(Webpage, [
  'roles',
  'webpage_id',
  ...TRACKING_MODEL_FIELDS,
]) {
  role_ids: Role['role_id'][];
}

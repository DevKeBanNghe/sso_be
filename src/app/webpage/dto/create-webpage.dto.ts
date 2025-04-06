import { OmitType } from '@nestjs/mapped-types';
import { Webpage, Role } from '@prisma-postgresql/models';
import { ImportExcel } from 'src/common/classes/base.class';
import { TRACKING_MODEL_FIELDS } from 'src/consts/model.const';

class CreateWebpageDto extends OmitType(Webpage, [
  'roles',
  'users',
  'webpage_id',
  ...TRACKING_MODEL_FIELDS,
]) {
  role_ids: Role['role_id'][];
}

class ImportWebpagesDto extends ImportExcel {}

export { CreateWebpageDto, ImportWebpagesDto };

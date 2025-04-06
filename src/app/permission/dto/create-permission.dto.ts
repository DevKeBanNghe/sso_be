import { OmitType } from '@nestjs/mapped-types';
import { Permission } from '@prisma-postgresql/models';
import { ImportExcel } from 'src/common/classes/base.class';
import { TRACKING_MODEL_FIELDS } from 'src/consts/model.const';

class CreatePermissionDto extends OmitType(Permission, [
  'children',
  'parent',
  'roles',
  'permission_id',
  ...TRACKING_MODEL_FIELDS,
]) {}

class ImportPermissionsDto extends ImportExcel {}

export { CreatePermissionDto, ImportPermissionsDto };

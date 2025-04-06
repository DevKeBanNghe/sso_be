import { OmitType } from '@nestjs/mapped-types';
import { Role } from '@prisma-postgresql/models';
import { ImportExcel } from 'src/common/classes/base.class';
import { TRACKING_MODEL_FIELDS } from 'src/consts/model.const';

class CreateRoleDto extends OmitType(Role, [
  'children',
  'parent',
  'users',
  'permissions',
  'webpage',
  'role_id',
  ...TRACKING_MODEL_FIELDS,
]) {}

class ImportRolesDto extends ImportExcel {}

export { CreateRoleDto, ImportRolesDto };

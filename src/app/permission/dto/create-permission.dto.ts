import { OmitType } from '@nestjs/mapped-types';
import { Permission } from '@prisma-postgresql/models';
import { TRACKING_MODEL_FIELDS } from 'src/consts/model.const';

export class CreatePermissionDto extends OmitType(Permission, [
  'children',
  'parent',
  'roles',
  'permission_id',
  ...TRACKING_MODEL_FIELDS,
]) {}

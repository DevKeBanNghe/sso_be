import { OmitType } from '@nestjs/mapped-types';
import { Role } from '@prisma-postgresql/models';
import { TRACKING_MODEL_FIELDS } from 'src/consts/model.const';

export class CreateRoleDto extends OmitType(Role, [
  'children',
  'parent',
  'users',
  'permissions',
  'webpage',
  'role_id',
  ...TRACKING_MODEL_FIELDS,
]) {}

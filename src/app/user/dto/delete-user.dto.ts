import { OmitType, PartialType } from '@nestjs/mapped-types';
import { User } from '@prisma-postgresql/models';

export class DeleteUserDto extends OmitType(PartialType(User), [
  'devices',
] as const) {}

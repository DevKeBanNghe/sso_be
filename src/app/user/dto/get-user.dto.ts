import { OmitType, PartialType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class ConditionDto extends OmitType(PartialType(User), [
  'user_devices',
] as const) {}

import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { Role } from '../entities/role.entity';
import { CreateRoleDto } from './create-group-role.dto';

export class UpdateRoleDto extends IntersectionType(
  PickType(Role, ['role_id']),
  PartialType(CreateRoleDto)
) {}

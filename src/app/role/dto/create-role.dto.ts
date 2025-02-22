import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { Role } from '../entities/role.entity';

export class CreateRoleDto extends IntersectionType(
  PickType(Role, ['role_name', 'created_by']),
  PartialType(Role)
) {}

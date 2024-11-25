import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { Role } from '../entities/role.entity';
import { CreateRoleDto } from './create-role.dto';
import { Webpage } from 'src/app/webpage/entities/webpage.entity';

export class UpdateRoleDto extends IntersectionType(
  PickType(Role, ['role_id']),
  PartialType(CreateRoleDto)
) {}

export class UpdateWebpageDto extends IntersectionType(
  PickType(Webpage, ['webpage_id'])
) {
  role_ids: Role['role_id'][];
}

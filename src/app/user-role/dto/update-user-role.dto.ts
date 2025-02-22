import { PickType } from '@nestjs/mapped-types';
import { Role } from 'src/app/role/entities/role.entity';
import { User } from 'src/app/user/entities/user.entity';

export class UpdateUserRoleDto extends PickType(User, ['user_id']) {
  role_ids: Role['role_id'][];
}

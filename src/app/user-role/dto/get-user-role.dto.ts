import { Role } from 'src/app/role/entities/role.entity';
import { User } from 'src/app/user/entities/user.entity';

class GetUserRoleListDto {
  user_id_role_id_list: Array<{
    user_id: User['user_id'];
    role_id: Role['role_id'];
  }>;
}

export { GetUserRoleListDto };

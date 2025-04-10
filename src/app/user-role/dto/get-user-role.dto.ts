import { User, Role } from '@prisma-postgresql/models';

class GetUserRoleListDto {
  user_id_role_id_list: Array<{
    user_id: User['user_id'];
    role_id: Role['role_id'];
  }>;
}

export { GetUserRoleListDto };

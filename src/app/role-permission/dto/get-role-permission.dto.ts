import { Permission, Role } from '@prisma-postgresql/models';

class GetRolePermissionListDto {
  permission_id_role_id_list: Array<{
    permission_id: Permission['permission_id'];
    role_id: Role['role_id'];
  }>;
}

export { GetRolePermissionListDto };

import { Permission } from 'src/app/permission/entities/permission.entity';
import { Role } from 'src/app/role/entities/role.entity';

class GetRolePermissionListDto {
  permission_id_role_id_list: Array<{
    permission_id: Permission['permission_id'];
    role_id: Role['role_id'];
  }>;
}

export { GetRolePermissionListDto };

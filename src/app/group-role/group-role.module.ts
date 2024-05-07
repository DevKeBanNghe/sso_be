import { Module } from '@nestjs/common';
import { GroupRoleService } from './group-role.service';
import { GroupRoleController } from './group-role.controller';
import { GroupPermissionModule } from '../group-permission/group-permission.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [GroupPermissionModule, RoleModule],
  controllers: [GroupRoleController],
  providers: [GroupRoleService],
})
export class GroupRoleModule {}

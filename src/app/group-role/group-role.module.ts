import { Module } from '@nestjs/common';
import { GroupRoleService } from './group-role.service';
import { GroupRoleController } from './group-role.controller';
import { GroupPermissionModule } from '../group-permission/group-permission.module';

@Module({
  imports: [GroupPermissionModule],
  controllers: [GroupRoleController],
  providers: [GroupRoleService],
})
export class GroupRoleModule {}

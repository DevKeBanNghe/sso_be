import { Module } from '@nestjs/common';
import { GroupPermissionService } from './group-permission.service';
import { GroupPermissionController } from './group-permission.controller';
import { PermissionService } from '../permission/permission.service';

@Module({
  controllers: [GroupPermissionController],
  providers: [GroupPermissionService, PermissionService],
  exports: [GroupPermissionService],
})
export class GroupPermissionModule {}

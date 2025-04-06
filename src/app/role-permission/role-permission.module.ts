import { Module } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionController } from './role-permission.controller';
import { ExcelUtilModule } from 'src/common/utils/excel/excel-util.module';
import { RoleModule } from '../role/role.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [ExcelUtilModule, RoleModule, PermissionModule],
  controllers: [RolePermissionController],
  providers: [RolePermissionService],
})
export class RolePermissionModule {}

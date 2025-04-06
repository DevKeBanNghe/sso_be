import { Module } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { UserRoleController } from './user-role.controller';
import { ExcelUtilModule } from 'src/common/utils/excel/excel-util.module';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [ExcelUtilModule, UserModule, RoleModule],
  controllers: [UserRoleController],
  providers: [UserRoleService],
})
export class UserRoleModule {}

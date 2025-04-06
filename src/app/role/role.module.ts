import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { ExcelUtilModule } from 'src/common/utils/excel/excel-util.module';

@Module({
  imports: [ExcelUtilModule],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}

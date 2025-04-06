import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { CaslAbilityModule } from 'src/common/guards/access-control/casl/casl-ability.module';
import { ExcelUtilModule } from 'src/common/utils/excel/excel-util.module';

@Module({
  imports: [CaslAbilityModule, ExcelUtilModule],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}

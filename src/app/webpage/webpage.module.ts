import { Module } from '@nestjs/common';
import { WebpageService } from './webpage.service';
import { WebpageController } from './webpage.controller';
import { RoleModule } from '../role/role.module';
import { ExcelUtilModule } from 'src/common/utils/excel/excel-util.module';

@Module({
  imports: [RoleModule, ExcelUtilModule],
  controllers: [WebpageController],
  providers: [WebpageService],
  exports: [WebpageService],
})
export class WebpageModule {}

import { Module } from '@nestjs/common';
import { ExcelUtilService } from './excel-util.service';
import { StringUtilModule } from '../string/string-util.module';

@Module({
  imports: [StringUtilModule],
  providers: [ExcelUtilService],
  exports: [ExcelUtilService],
})
export class ExcelUtilModule {}

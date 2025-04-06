import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { StringUtilModule } from 'src/common/utils/string/string-util.module';
import { PrismaService } from 'src/common/db/prisma/prisma.service';
import { WebpageModule } from '../webpage/webpage.module';
import { ExcelUtilModule } from 'src/common/utils/excel/excel-util.module';
@Module({
  imports: [StringUtilModule, WebpageModule, ExcelUtilModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}

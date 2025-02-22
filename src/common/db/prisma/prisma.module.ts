import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DateUtilModule } from 'src/common/utils/date/date-util.module';
import { DateUtilService } from 'src/common/utils/date/date-util.service';

@Global()
@Module({
  imports: [DateUtilModule],
  providers: [PrismaService, DateUtilService],
  exports: [PrismaService, DateUtilService],
})
export class PrismaModule {}

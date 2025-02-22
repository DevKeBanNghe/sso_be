import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DateUtilModule } from 'src/common/utils/date/date-util.module';

@Global()
@Module({
  imports: [DateUtilModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

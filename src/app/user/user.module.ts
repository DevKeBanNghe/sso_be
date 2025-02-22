import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { StringUtilModule } from 'src/common/utils/string/string-util.module';
import { PrismaService } from 'src/common/db/prisma/prisma.service';
@Module({
  imports: [StringUtilModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}

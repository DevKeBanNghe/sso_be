import { Module } from '@nestjs/common';
import { StringUtilService } from './string-util.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [StringUtilService, JwtService],
  exports: [StringUtilService],
})
export class StringUtilModule {}

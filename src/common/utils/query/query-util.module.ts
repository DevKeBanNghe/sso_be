import { Global, Module } from '@nestjs/common';
import { QueryUtilService } from './query-util.service';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  providers: [QueryUtilService, JwtService],
  exports: [QueryUtilService],
})
export class QueryUtilModule {}

import { Global, Module } from '@nestjs/common';
import { StringService } from './string.service';

@Global()
@Module({
  providers: [StringService],
  exports: [StringService],
})
export class StringModule {}

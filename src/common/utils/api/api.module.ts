import { Global, Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [ApiService, ConfigService],
  exports: [ApiService],
})
export class ApiModule {}

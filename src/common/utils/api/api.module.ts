import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [ApiService, ConfigService],
  exports: [ApiService],
})
export class ApiModule {}

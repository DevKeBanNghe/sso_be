import { Module } from '@nestjs/common';
import { WebpageService } from './webpage.service';
import { WebpageController } from './webpage.controller';

@Module({
  controllers: [WebpageController],
  providers: [WebpageService],
})
export class WebpageModule {}

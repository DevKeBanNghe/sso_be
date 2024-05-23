import { Module } from '@nestjs/common';
import { WebpageService } from './webpage.service';
import { WebpageController } from './webpage.controller';
import { RoleService } from '../role/role.service';

@Module({
  controllers: [WebpageController],
  providers: [WebpageService, RoleService],
  exports: [WebpageService],
})
export class WebpageModule {}

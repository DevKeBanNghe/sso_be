import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { CaslAbilityModule } from 'src/common/guards/access-control/casl/casl-ability.module';

@Module({
  imports: [CaslAbilityModule],
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}

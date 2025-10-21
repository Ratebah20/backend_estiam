import { Module } from '@nestjs/common';
import { InterventionService } from './intervention.service';
import { InterventionResolver } from './intervention.resolver';

@Module({
  providers: [InterventionResolver, InterventionService],
  exports: [InterventionService],
})
export class InterventionModule {}

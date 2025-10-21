import { Module } from '@nestjs/common';
import { ProjetService } from './projet.service';
import { ProjetResolver } from './projet.resolver';

@Module({
  providers: [ProjetResolver, ProjetService],
  exports: [ProjetService],
})
export class ProjetModule {}

import { Module } from '@nestjs/common';
import { SalarieService } from './salarie.service';
import { SalarieResolver } from './salarie.resolver';

@Module({
  providers: [SalarieResolver, SalarieService],
  exports: [SalarieService],
})
export class SalarieModule {}

import { Module } from '@nestjs/common';
import { MaterielService } from './materiel.service';
import { MaterielResolver } from './materiel.resolver';

@Module({
  providers: [MaterielResolver, MaterielService],
  exports: [MaterielService],
})
export class MaterielModule {}

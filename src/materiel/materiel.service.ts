import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaterielInput } from './dto/create-materiel.input';

@Injectable()
export class MaterielService {
  constructor(private prisma: PrismaService) {}

  async create(createMaterielInput: CreateMaterielInput) {
    return this.prisma.materiel.create({
      data: createMaterielInput,
    });
  }

  async findAll() {
    return this.prisma.materiel.findMany({
      include: { interventions: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.materiel.findUnique({
      where: { id },
      include: { interventions: true },
    });
  }

  async update(id: string, designation: string) {
    return this.prisma.materiel.update({
      where: { id },
      data: { designation },
    });
  }

  async remove(id: string) {
    await this.prisma.materiel.delete({
      where: { id },
    });
    return true;
  }
}

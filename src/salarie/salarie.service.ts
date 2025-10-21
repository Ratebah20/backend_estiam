import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSalarieInput } from './dto/create-salarie.input';

@Injectable()
export class SalarieService {
  constructor(private prisma: PrismaService) {}

  async create(createSalarieInput: CreateSalarieInput) {
    return this.prisma.salarie.create({
      data: createSalarieInput,
    });
  }

  async findAll() {
    return this.prisma.salarie.findMany({
      include: { interventions: { include: { projet: true } } },
    });
  }

  async findOne(id: string) {
    return this.prisma.salarie.findUnique({
      where: { id },
      include: { interventions: { include: { projet: true } } },
    });
  }

  async getPlanning(salarieId: string) {
    const now = new Date();

    return this.prisma.intervention.findMany({
      where: {
        salaries: {
          some: { id: salarieId },
        },
        date: {
          gte: now,
        },
      },
      include: {
        projet: { include: { client: true } },
        salaries: true,
        materiels: true,
      },
      orderBy: { date: 'asc' },
    });
  }

  async update(id: string, nom?: string, prenom?: string) {
    return this.prisma.salarie.update({
      where: { id },
      data: {
        ...(nom && { nom }),
        ...(prenom && { prenom }),
      },
    });
  }

  async remove(id: string) {
    await this.prisma.salarie.delete({
      where: { id },
    });
    return true;
  }
}

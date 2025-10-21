import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInterventionInput } from './dto/create-intervention.input';
import { UpdateInterventionInput } from './dto/update-intervention.input';

@Injectable()
export class InterventionService {
  constructor(private prisma: PrismaService) {}

  async create(createInterventionInput: CreateInterventionInput) {
    const { salarieIds, materielIds, ...data } = createInterventionInput;

    return this.prisma.intervention.create({
      data: {
        ...data,
        date: new Date(data.date),
        salaries: {
          connect: salarieIds.map((id) => ({ id })),
        },
        materiels: {
          connect: materielIds.map((id) => ({ id })),
        },
      },
      include: {
        projet: { include: { client: true } },
        salaries: true,
        materiels: true,
      },
    });
  }

  async findAll() {
    return this.prisma.intervention.findMany({
      include: {
        projet: { include: { client: true } },
        salaries: true,
        materiels: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.intervention.findUnique({
      where: { id },
      include: {
        projet: { include: { client: true } },
        salaries: true,
        materiels: true,
      },
    });
  }

  async findByProjet(projetId: string) {
    return this.prisma.intervention.findMany({
      where: { projetId },
      include: {
        salaries: true,
        materiels: true,
      },
      orderBy: { date: 'asc' },
    });
  }

  async findFuture() {
    const now = new Date();
    return this.prisma.intervention.findMany({
      where: {
        date: { gte: now },
      },
      include: {
        projet: { include: { client: true } },
        salaries: true,
        materiels: true,
      },
      orderBy: { date: 'asc' },
    });
  }

  async update(id: string, updateInterventionInput: UpdateInterventionInput) {
    const { salarieIds, materielIds, date, ...data } = updateInterventionInput;

    return this.prisma.intervention.update({
      where: { id },
      data: {
        ...data,
        ...(date && { date: new Date(date) }),
        ...(salarieIds && {
          salaries: {
            set: salarieIds.map((id) => ({ id })),
          },
        }),
        ...(materielIds && {
          materiels: {
            set: materielIds.map((id) => ({ id })),
          },
        }),
      },
      include: {
        projet: { include: { client: true } },
        salaries: true,
        materiels: true,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.intervention.delete({
      where: { id },
    });
    return true;
  }
}

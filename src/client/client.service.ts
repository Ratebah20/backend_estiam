import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientInput } from './dto/create-client.input';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async create(createClientInput: CreateClientInput) {
    return this.prisma.client.create({
      data: createClientInput,
    });
  }

  async findAll() {
    return this.prisma.client.findMany({
      include: { projets: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.client.findUnique({
      where: { id },
      include: { projets: true },
    });
  }

  async update(id: string, adresse: string) {
    return this.prisma.client.update({
      where: { id },
      data: { adresse },
    });
  }

  async remove(id: string) {
    await this.prisma.client.delete({
      where: { id },
    });
    return true;
  }
}

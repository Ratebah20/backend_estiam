import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjetInput } from './dto/create-projet.input';

@Injectable()
export class ProjetService {
  constructor(private prisma: PrismaService) {}

  async create(createProjetInput: CreateProjetInput) {
    return this.prisma.projet.create({
      data: createProjetInput,
      include: { client: true, interventions: true },
    });
  }

  async findAll() {
    const projets = await this.prisma.projet.findMany({
      include: { client: true, interventions: true },
    });

    return projets.map((projet) => this.calculateTemps(projet));
  }

  async findOne(id: string) {
    const projet = await this.prisma.projet.findUnique({
      where: { id },
      include: { client: true, interventions: true },
    });

    return this.calculateTemps(projet);
  }

  async findByClient(clientId: string) {
    const projets = await this.prisma.projet.findMany({
      where: { clientId },
      include: { interventions: true },
    });

    return projets.map((projet) => this.calculateTemps(projet));
  }

  async update(id: string, nom: string) {
    return this.prisma.projet.update({
      where: { id },
      data: { nom },
      include: { client: true, interventions: true },
    });
  }

  async remove(id: string) {
    await this.prisma.projet.delete({
      where: { id },
    });
    return true;
  }

  private calculateTemps(projet: any) {
    if (!projet) return null;

    const now = new Date();
    const interventions = projet.interventions || [];

    // Calculer le temps total (somme de toutes les durées)
    const tempsTotal = interventions.reduce(
      (sum: number, intervention: any) => sum + intervention.duree,
      0,
    );

    // Calculer le temps restant (interventions à venir)
    const tempsRestant = interventions
      .filter((intervention: any) => new Date(intervention.date) >= now)
      .reduce((sum: number, intervention: any) => sum + intervention.duree, 0);

    return {
      ...projet,
      tempsTotal,
      tempsRestant,
    };
  }
}

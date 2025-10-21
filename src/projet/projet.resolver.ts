import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProjetService } from './projet.service';
import { Projet } from './models/projet.model';
import { CreateProjetInput } from './dto/create-projet.input';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Resolver(() => Projet)
export class ProjetResolver {
  constructor(private readonly projetService: ProjetService) {}

  @Roles(Role.ADMIN)
  @Mutation(() => Projet)
  createProjet(@Args('input') createProjetInput: CreateProjetInput) {
    return this.projetService.create(createProjetInput);
  }

  @Query(() => [Projet], { name: 'projets' })
  findAll() {
    return this.projetService.findAll();
  }

  @Query(() => Projet, { name: 'projet', nullable: true })
  findOne(@Args('id') id: string) {
    return this.projetService.findOne(id);
  }

  @Query(() => [Projet], { name: 'projetsByClient' })
  findByClient(@Args('clientId') clientId: string) {
    return this.projetService.findByClient(clientId);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Projet)
  updateProjet(@Args('id') id: string, @Args('nom') nom: string) {
    return this.projetService.update(id, nom);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Boolean)
  deleteProjet(@Args('id') id: string) {
    return this.projetService.remove(id);
  }
}

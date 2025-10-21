import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { InterventionService } from './intervention.service';
import { Intervention } from './models/intervention.model';
import { CreateInterventionInput } from './dto/create-intervention.input';
import { UpdateInterventionInput } from './dto/update-intervention.input';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Resolver(() => Intervention)
export class InterventionResolver {
  constructor(private readonly interventionService: InterventionService) {}

  @Roles(Role.ADMIN)
  @Mutation(() => Intervention)
  createIntervention(@Args('input') createInterventionInput: CreateInterventionInput) {
    return this.interventionService.create(createInterventionInput);
  }

  @Query(() => [Intervention], { name: 'interventions' })
  findAll() {
    return this.interventionService.findAll();
  }

  @Query(() => Intervention, { name: 'intervention', nullable: true })
  findOne(@Args('id') id: string) {
    return this.interventionService.findOne(id);
  }

  @Query(() => [Intervention], { name: 'interventionsByProjet' })
  findByProjet(@Args('projetId') projetId: string) {
    return this.interventionService.findByProjet(projetId);
  }

  @Query(() => [Intervention], { name: 'interventionsAvenir' })
  findFuture() {
    return this.interventionService.findFuture();
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Intervention)
  updateIntervention(
    @Args('id') id: string,
    @Args('input') updateInterventionInput: UpdateInterventionInput,
  ) {
    return this.interventionService.update(id, updateInterventionInput);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Boolean)
  deleteIntervention(@Args('id') id: string) {
    return this.interventionService.remove(id);
  }
}

import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SalarieService } from './salarie.service';
import { Salarie } from './models/salarie.model';
import { CreateSalarieInput } from './dto/create-salarie.input';
import { Intervention } from '../intervention/models/intervention.model';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Resolver(() => Salarie)
export class SalarieResolver {
  constructor(private readonly salarieService: SalarieService) {}

  @Roles(Role.ADMIN)
  @Mutation(() => Salarie)
  createSalarie(@Args('input') createSalarieInput: CreateSalarieInput) {
    return this.salarieService.create(createSalarieInput);
  }

  @Query(() => [Salarie], { name: 'salaries' })
  findAll() {
    return this.salarieService.findAll();
  }

  @Query(() => Salarie, { name: 'salarie', nullable: true })
  findOne(@Args('id') id: string) {
    return this.salarieService.findOne(id);
  }

  @Query(() => [Intervention], { name: 'planningSalarie' })
  getPlanning(@Args('salarieId') salarieId: string) {
    return this.salarieService.getPlanning(salarieId);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Salarie)
  updateSalarie(
    @Args('id') id: string,
    @Args('nom', { nullable: true }) nom?: string,
    @Args('prenom', { nullable: true }) prenom?: string,
  ) {
    return this.salarieService.update(id, nom, prenom);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Boolean)
  deleteSalarie(@Args('id') id: string) {
    return this.salarieService.remove(id);
  }
}

import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MaterielService } from './materiel.service';
import { Materiel } from './models/materiel.model';
import { CreateMaterielInput } from './dto/create-materiel.input';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Resolver(() => Materiel)
export class MaterielResolver {
  constructor(private readonly materielService: MaterielService) {}

  @Roles(Role.ADMIN)
  @Mutation(() => Materiel)
  createMateriel(@Args('input') createMaterielInput: CreateMaterielInput) {
    return this.materielService.create(createMaterielInput);
  }

  @Query(() => [Materiel], { name: 'materiels' })
  findAll() {
    return this.materielService.findAll();
  }

  @Query(() => Materiel, { name: 'materiel', nullable: true })
  findOne(@Args('id') id: string) {
    return this.materielService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Materiel)
  updateMateriel(@Args('id') id: string, @Args('designation') designation: string) {
    return this.materielService.update(id, designation);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Boolean)
  deleteMateriel(@Args('id') id: string) {
    return this.materielService.remove(id);
  }
}

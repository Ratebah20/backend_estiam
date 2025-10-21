import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ClientService } from './client.service';
import { Client } from './models/client.model';
import { CreateClientInput } from './dto/create-client.input';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Resolver(() => Client)
export class ClientResolver {
  constructor(private readonly clientService: ClientService) {}

  @Roles(Role.ADMIN)
  @Mutation(() => Client)
  createClient(@Args('input') createClientInput: CreateClientInput) {
    return this.clientService.create(createClientInput);
  }

  @Query(() => [Client], { name: 'clients' })
  findAll() {
    return this.clientService.findAll();
  }

  @Query(() => Client, { name: 'client', nullable: true })
  findOne(@Args('id') id: string) {
    return this.clientService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Client)
  updateClient(@Args('id') id: string, @Args('adresse') adresse: string) {
    return this.clientService.update(id, adresse);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Boolean)
  deleteClient(@Args('id') id: string) {
    return this.clientService.remove(id);
  }
}

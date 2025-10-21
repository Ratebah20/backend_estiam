import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Salarie {
  @Field(() => ID)
  id: string;

  @Field()
  nom: string;

  @Field()
  prenom: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class Projet {
  @Field(() => ID)
  id: string;

  @Field()
  nom: string;

  @Field()
  clientId: string;

  @Field(() => Float, { nullable: true })
  tempsTotal?: number;

  @Field(() => Float, { nullable: true })
  tempsRestant?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

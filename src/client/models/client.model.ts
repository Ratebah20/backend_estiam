import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Client {
  @Field(() => ID)
  id: string;

  @Field()
  adresse: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

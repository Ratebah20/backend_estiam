import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Materiel {
  @Field(() => ID)
  id: string;

  @Field()
  designation: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

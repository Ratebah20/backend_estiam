import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Salarie } from '../../salarie/models/salarie.model';
import { Materiel } from '../../materiel/models/materiel.model';

@ObjectType()
export class Intervention {
  @Field(() => ID)
  id: string;

  @Field()
  date: Date;

  @Field(() => Float)
  duree: number;

  @Field()
  projetId: string;

  @Field(() => [Salarie], { nullable: true })
  salaries?: Salarie[];

  @Field(() => [Materiel], { nullable: true })
  materiels?: Materiel[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

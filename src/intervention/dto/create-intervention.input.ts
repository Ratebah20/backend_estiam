import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, IsNumber, IsArray, IsDateString } from 'class-validator';

@InputType()
export class CreateInterventionInput {
  @Field()
  @IsDateString()
  date: string;

  @Field(() => Float)
  @IsNumber()
  duree: number;

  @Field()
  @IsUUID()
  @IsNotEmpty()
  projetId: string;

  @Field(() => [String])
  @IsArray()
  salarieIds: string[];

  @Field(() => [String])
  @IsArray()
  materielIds: string[];
}

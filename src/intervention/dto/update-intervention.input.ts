import { InputType, Field, Float } from '@nestjs/graphql';
import { IsOptional, IsUUID, IsNumber, IsArray, IsDateString } from 'class-validator';

@InputType()
export class UpdateInterventionInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  date?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  duree?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  projetId?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  salarieIds?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  materielIds?: string[];
}

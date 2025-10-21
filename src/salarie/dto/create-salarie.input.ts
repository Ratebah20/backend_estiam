import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateSalarieInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  nom: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  prenom: string;
}

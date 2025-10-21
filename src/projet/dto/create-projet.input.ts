import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class CreateProjetInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  nom: string;

  @Field()
  @IsUUID()
  clientId: string;
}

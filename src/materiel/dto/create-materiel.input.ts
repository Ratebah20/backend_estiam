import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateMaterielInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  designation: string;
}

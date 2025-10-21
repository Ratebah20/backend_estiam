import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;

  @Field()
  @IsString()
  nom: string;

  @Field()
  @IsString()
  prenom: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  password: string;
}

@ObjectType()
export class UserResponse {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  nom: string;

  @Field()
  prenom: string;

  @Field()
  role: string;
}

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field(() => UserResponse)
  user: UserResponse;
}

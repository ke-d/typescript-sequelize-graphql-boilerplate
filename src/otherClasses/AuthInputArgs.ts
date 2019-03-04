import { IsEmail, Length } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export default class RecipeInput {
  @Field()
  @IsEmail()
  public email!: string;

  @Field()
  @Length(8, 255)
  public password!: string;
}

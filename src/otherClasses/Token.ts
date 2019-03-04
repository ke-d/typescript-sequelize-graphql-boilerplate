import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class Token {
  @Field()
  public token!: string;
}

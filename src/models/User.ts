import {
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { Field, ObjectType } from 'type-graphql';
import Post from './Post';

@ObjectType()
@Table
export default class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  public id!: string;

  @Field({ description: 'Email of the user.' })
  @Unique
  @Column
  public email!: string;

  @Column
  public password!: string;

  @Field({
    description: 'The bio of the user.',
    nullable: true,
  })
  @Column
  public bio?: string;

  @Field(() => [Post])
  @HasMany(() => Post)
  public posts!: Post[];

  @Field()
  @CreatedAt
  public createdAt!: Date;

  @Field()
  @UpdatedAt
  public updatedAt!: Date;
}

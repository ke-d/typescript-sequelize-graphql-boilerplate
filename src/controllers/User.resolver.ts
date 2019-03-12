import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import {
  Arg,
  Args,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import Post from '../models/Post';
import User from '../models/User';
import AuthInputArgs from '../otherClasses/AuthInputArgs';
import Token from '../otherClasses/Token';
import { IContext, IUserPayLoad, Role } from '../utils/ContextInterface';

const expiresIn = '1y';

@Resolver(User)
export default class UserResolver {
  @Authorized([Role.USER])
  @Query((returns) => User)
  public async user(@Ctx() ctx: IContext) {
    if (ctx.user && ctx.user.role === Role.USER) {
      const user = await User.findOne({
        where: { id: ctx.user.id },
      });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    }
    throw new Error('User not found');
  }

  @Query((returns) => User)
  public async userFind(@Arg('email') email: string) {
    const user = await User.findOne({
      where: { email },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  @FieldResolver()
  public async posts(@Root() user: User) {
    const posts = await Post.findAll({
      where: {
        userId: user.id,
      },
    });
    return posts;
  }

  @Mutation(() => Token)
  public async userSignIn(@Args()
  {
    email,
    password,
  }: AuthInputArgs) {
    // Check if the user is valid
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('No user with that email');
    }

    // Check if the password is valid
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Incorrect password');
    }
    const payload: IUserPayLoad = {
      id: user.id,
      role: Role.USER,
    };
    // Generate a new token a save it
    const token = jsonwebtoken.sign(payload, process.env.CRYPTO_KEY!, {
      expiresIn,
    });

    return { token };
  }

  @Mutation(() => Token)
  public async userSignUp(
    @Args()
    { email, password }: AuthInputArgs,
    @Arg('bio', { nullable: true }) bio: string,
  ) {
    // Find if there is an existing account
    const user = await User.findOne({ where: { email } });

    if (user) {
      throw new Error('Email exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      bio,
      email,
      password: hashedPassword,
    });
    const payload: IUserPayLoad = {
      id: newUser.id,
      role: Role.USER,
    };
    const token = jsonwebtoken.sign(payload, process.env.CRYPTO_KEY!, {
      expiresIn,
    });
    return { token };
  }
}

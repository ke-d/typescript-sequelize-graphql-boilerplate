import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import Post from '../models/Post';
import { IContext, Role } from '../utils/ContextInterface';

@Resolver(Post)
export default class PostResolver {
  @Authorized([Role.USER])
  @Mutation(() => Boolean)
  public async createPost(
    @Ctx() ctx: IContext,
    @Arg('message') message: string,
  ) {
    if (ctx.user && ctx.user.role === Role.USER) {
      Post.create({ userId: ctx.user.id, message });
      return true;
    }
    throw new Error('User not found');
  }
}

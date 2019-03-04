import { AuthChecker } from 'type-graphql';
import { IContext } from './ContextInterface';

export const customAuthChecker: AuthChecker<IContext> = (
  { root, args, context, info },
  roles,
) => {
  const { user } = context;
  // here you can read user from context
  // and check his permission in db against `roles` argument
  // that comes from `@Authorized`, eg. ["ADMIN", "MODERATOR"]
  if (roles.length === 0) {
    // if `@Authorized()`, check only is user exist
    return user !== undefined;
  }
  // there are some roles defined now

  if (!user) {
    // and if no user, restrict access
    return false;
  }
  if (roles.includes(user.role)) {
    return true;
  }

  // no roles matched, restrict access
  return false;
};

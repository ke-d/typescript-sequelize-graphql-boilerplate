export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface IAdminPayLoad {
  id: string;
  role: Role.ADMIN;
}
export interface IUserPayLoad {
  id: string;
  role: Role.USER;
}

export type IJWTPayLoad = IAdminPayLoad | IUserPayLoad;

export interface IContext {
  user?: IJWTPayLoad;
}

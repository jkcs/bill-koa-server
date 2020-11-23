import User from '@/src/model/User'
import { RouterContext } from 'koa-router'

declare namespace UserRouter{
  export type UserRouterContext<StateT = any, CustomT = {}> =
    RouterContext<StateT, CustomT & IRouterUserContext<StateT, CustomT>>;
  export interface IRouterUserContext<StateT = any, CustomT = {}> {
    getUserInfo(): Promise<User>
    getUserId(): number
  }
}

export = UserRouter;

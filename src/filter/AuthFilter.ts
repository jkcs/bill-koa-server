import Constant from '@/src/constants/Constant'
import BeanContainer from '@/core/model/container/BeanContainer'
import UserService from '@/src/service/UserService'
import User from '@/src/model/User'
import UserRouter from '@/types/UserRouterContext'
import TokenInvalidException from '@/src/exception/TokenInvalidException'
import { decrypt } from '@/src/utils/Crypto'
import Log from '@/core/model/log/Log'
import ControllerContainer from '@/core/model/container/ControllerContainer'
import AuthPathContainer from '@/core/model/container/AuthPathContainer'
import UserRouterContext = UserRouter.UserRouterContext

module.exports = async (ctx: UserRouterContext, next: any) => {
  Log.f(ctx.request.url)
  Log.f(AuthPathContainer.Instance.set)
  const token = ctx.request.headers[Constant.TOKEN]
  if (token) {
    ctx.getUserInfo = async (): Promise<User> => {
      const userService = BeanContainer.Instance.getBean<UserService>(UserService.name)
      const user:User = await userService.getUserById(Number(decrypt(token)))
      if (!user) throw new TokenInvalidException()
      return user
    }
  }
}

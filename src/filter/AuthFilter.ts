import Constant from '@/src/constants/Constant'
import BeanContainer from '@/core/model/container/BeanContainer'
import UserService from '@/src/service/UserService'
import User from '@/src/model/User'
import UserRouter from '@/types/UserRouterContext'
import TokenInvalidException from '@/src/exception/TokenInvalidException'
import { decrypt } from '@/src/utils/Crypto'
import AuthPathContainer from '@/core/model/container/AuthPathContainer'
import UserRouterContext = UserRouter.UserRouterContext

module.exports = async (ctx: UserRouterContext, next: any) => {
  if (AuthPathContainer.Instance.has(ctx.request.url)) {
    const token = ctx.request.headers[Constant.TOKEN]
    if (token) {
      ctx.getUserId = (): number => {
        const id = Number(decrypt(token))
        if (isNaN(id) || !id) throw new TokenInvalidException()
        return id
      }
      ctx.getUserInfo = async (): Promise<User> => {
        const userService = BeanContainer.Instance.getBean<UserService>(UserService.name)
        const userId = ctx.getUserId()
        const user:User = await userService.getUserById(userId)
        if (!user) throw new TokenInvalidException()
        return user
      }
    } else {
      throw new TokenInvalidException()
    }
  }
}

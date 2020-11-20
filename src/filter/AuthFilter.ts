import Constant from '@/src/constants/Constant'
import BeanContainer from '@/core/model/container/BeanContainer'
import UserService from '@/src/service/UserService'
import User from '@/src/model/User'
import UserRouter from '@/types/UserRouterContext'
import TokenInvalidException from '@/src/exception/TokenInvalidException'
import { decrypt } from '@/src/utils/Crypto'
import UserRouterContext = UserRouter.UserRouterContext

async function getUserInfo (token: string) {
  const userService = BeanContainer.Instance.getBean<UserService>(UserService.name)
  return await userService.getUserById(Number(decrypt(token)))
}

module.exports = async (ctx: UserRouterContext) => {
  const token = ctx.request.headers[Constant.TOKEN]
  if (token) {
    const user:User = await getUserInfo(token)
    if (user.id) {
      ctx.getUserInfo = (): User => user
      return
    }
    throw new TokenInvalidException()
  }
}

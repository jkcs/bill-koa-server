import Constant from '@/src/constants/Constant'
import BeanContainer from '@/core/model/container/BeanContainer'
import UserService from '@/src/service/UserService'
import User from '@/src/model/User'
import UserRouter from '@/types/UserRouterContext'
import TokenInvalidException from '@/src/exception/TokenInvalidException'
import UserRouterContext = UserRouter.UserRouterContext

async function getUserInfo (token: string): Promise<User> {
  const userService = BeanContainer.Instance.getBean<UserService>(UserService.name)
  return await userService.loginByDeviceCode(token)
}

module.exports = async (ctx: UserRouterContext) => {
  const token = ctx.request.headers[Constant.TOKEN]
  if (token) {
    await getUserInfo(token)
      .then(user => {
        if (user.id) {
          ctx.getUserInfo = (): User => user
          return
        }
        throw new TokenInvalidException()
      })
  }
}

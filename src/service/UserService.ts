import User from '../model/User'
import { Service } from '@/core/decorator/ContainerDecorator'
import { hash } from '@/src/utils/Crypto'
import CantNotUpdateException from '@/src/exception/CantNotUpdateException'
import BusinessException from '@/src/exception/BusinessException'
import { injectModel } from '@/src/utils/Utils'

@Service
export default class UserService {
  async getUserByHash (hash: string) {
    return await User.findOne({
      where: { hash }
    })
  }

  async getUserById (id: number) {
    return await User.findByPk(id)
  }

  async addOrUpdateUser (user: User, code?: string) {
    let user1:User
    if (!user.id && !user.hash && !code) {
      throw new CantNotUpdateException()
    }
    if (code) {
      user.hash = code ? hash(code) : user.hash
      const user1 = await this.getUserByHash(user.hash)
      if (user1) throw new BusinessException('用户已存在！')
      return await user.save()
    }
    if (user.id) {
      user1 = await this.getUserById(user.id)
      if (!user1) throw new BusinessException('用户不存在！')
    }
    injectModel(user1, user)
    return await user1.save()
  }

  async login (username: string, password: string) {
    return await User.build({ username, password }).reload()
  }

  async loginByDeviceCode (deviceCode: string) {
    const user = await User.build({ hash: hash(deviceCode) }).reload()
    // user.then
    console.log(user)
    return user
  }
}

import User from '../model/User'
import { Service } from '@/core/decorator/ContainerDecorator'
import { hash } from '@/src/utils/Hash'
import CantNotUpdateException from '@/src/exception/CantNotUpdateException'

@Service
export default class UserService {
  async getUserById (id: number): Promise<User> {
    return await User.findByPk(id)
  }

  async addOrUpdateUser (user: User, code?: string): Promise<User> {
    if (!user.id && !user.hash && !code) {
      throw new CantNotUpdateException()
    }
    user.hash = code ? hash(code) : user.hash
    return await user.save()
  }

  async login (username: string, password: string): Promise<User> {
    return await User.build({ username, password }).reload()
  }

  async loginByDeviceCode (deviceCode: string) {
    const user = await User.build({ hash: hash(deviceCode) }).reload()
    // user.then
    console.log(user)
    return user
  }
}

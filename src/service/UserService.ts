import User from '../model/User'
import { Service } from '@/core/decorator/ContainerDecorator'
import { hash, randomHash } from '@/src/utils/Crypto'
import CantNotUpdateException from '@/src/exception/CantNotUpdateException'
import BusinessException from '@/src/exception/BusinessException'
import { injectModel } from '@/src/utils/Utils'

@Service
export default class UserService {
  private tryGenerateHashNum:number = 6
  private randomHashLength:number = 6

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
    return await User.findOne({
      where: {
        hash: hash(deviceCode)
      }
    })
  }

  async findOrCreate (deviceCode: string) {
    return await User.findOrCreate({
      where: {
        hash: hash(deviceCode)
      }
    })
  }

  async generateHash () {
    const [code, hash] = randomHash(this.randomHashLength)
    let num = this.tryGenerateHashNum
    while (num) {
      if (!await this.getUserByHash(hash)) {
        return {
          code,
          hash
        }
      }
      --num
    }
    throw new BusinessException('网络繁忙，请尝试重新生成！')
  }
}

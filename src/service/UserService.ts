// @ts-ignore
import User from '../model/User'
import { AutoWired, Service } from '@/core/decorator/ContainerDecorator'
let moment = require('moment')

@Service
export default class UserService {
  getUserById (id: number) {
    // User.fin
    // user.
    return 1
  }

  login (username: string, password: string) {
    return (this as any).userDao.getUserByUsernameAndPassword(username, password)
  }

  // register (user: User) {
  //   // user.phone = user.username
  //   // user.gmtCreateTime = user.gmtUpdateTime = moment().format('YYYY-MM-DD HH:mm:ss')
  //   return (this as any).userDao.save(user)
  // }
}

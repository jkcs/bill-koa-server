import { Controller, Get, Post, RequestMapping } from '@/core/decorator/ControllerDecorator'
import UserService from '../service/UserService'
import { AutoWired } from '@/core/decorator/ContainerDecorator'
import Result from '@/src/utils/Result'
import { RouterContext } from 'koa-router'
import User from '@/src/model/User'
import { encrypt, hash } from '@/src/utils/Crypto'
import { UserRouterContext } from '@/types/UserRouterContext'
import { Auth } from '@/core/decorator/AuthDecorator'

@Controller
@RequestMapping('user')
export default class UserController {
  @AutoWired
  private userService: UserService
  @Auth
  @Get('/')
  public async getMyInfo (ctx: UserRouterContext) {
    ctx.body = Result.success(await ctx.getUserInfo())
  }

  @Get('/:id')
  public async getUser (ctx: RouterContext) {
    const { id } = ctx.params
    let user = await this.userService.getUserById(id)
    ctx.body = Result.success(user)
  }

  @Post('/save')
  public async saveOrUpdate (ctx: RouterContext) {
    const obj = ctx.request.body
    if (obj.isAdd) delete obj.hash
    if (obj.isAdd && !obj.deviceId) {
      ctx.body = Result.argError()
      return
    }
    if (obj.id) {
      delete obj.password
      delete obj.hash
    }
    let user:User = User.build({ ...ctx.request.body })
    user = await this.userService.addOrUpdateUser(user, obj.deviceId)
    ctx.body = Result.success(user)
  }

  @Post('/saveAndLogin')
  public async saveAndLogin (ctx: RouterContext) {
    const { deviceId } = ctx.request.body
    if (!deviceId) {
      ctx.body = Result.argError()
      return
    }
    let user:User = await this.userService.getUserByHash(hash(String(deviceId)))
    if (user) {
      ctx.body = Result.success(user, encrypt(String(user.id)))
      return
    }
    user = await this.userService.addOrUpdateUser(User.build(), String(deviceId))
    ctx.body = Result.success(user, encrypt(String(user.id)))
  }

  @Post('/findOrCreate')
  public async findOrCreate (ctx: RouterContext) {
    const { deviceId } = ctx.request.body
    if (!deviceId) {
      ctx.body = Result.argError()
      return
    }
    const [user] = await this.userService.findOrCreate(String(deviceId))
    ctx.body = Result.success(user, encrypt(String(user.id)))
  }

  @Post('/login')
  public async login (ctx: RouterContext) {
    const obj = ctx.request.body
    let user = User.build()
    if (obj.deviceId) {
      user = await this.userService.loginByDeviceCode(String(obj.deviceId))
    } else if (obj.username && obj.password) {
      user = await this.userService.login(obj.username, obj.password)
    } else {
      ctx.body = Result.argError()
    }
    if (user) {
      ctx.body = Result.success(user, encrypt(String(user.id)))
      return
    }
    ctx.body = Result.error('用户名或密码错误')
  }
}

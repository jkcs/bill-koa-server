import { Controller, Get, Post, RequestMapping } from '@/core/decorator/ControllerDecorator'
import UserService from '../service/UserService'
import { AutoWired } from '@/core/decorator/ContainerDecorator'
import Result from '@/src/utils/Result'
import { RouterContext } from 'koa-router'
import User from '@/src/model/User'

@Controller
@RequestMapping('user')
export default class UserController {
  @AutoWired
  private userService: UserService

  @Get('/:id')
  public async getUser (ctx: RouterContext) {
    try {
      const { id } = ctx.params
      let user = await this.userService.getUserById(id)
      ctx.body = Result.success(user)
    } catch (e) {
      ctx.body = Result.exception(e)
    }
  }

  @Post('/save')
  public async saveOrUpdate (ctx: RouterContext) {
    const obj = ctx.request.body
    if (obj.isAdd) delete obj.hash
    if (obj.isAdd && !obj.deviceCode) {
      ctx.body = Result.argError()
      return
    }
    const user:User = User.build(ctx.request.body)
    await this.userService.addOrUpdateUser(user, obj.deviceCode)
    ctx.body = Result.success(user)
  }

  @Post('/login')
  public async login (ctx: RouterContext) {
    const obj = ctx.request.body
    if (obj.deviceId) {
      ctx.body = await this.userService.loginByDeviceCode(obj.deviceId)
      return
    }
    if (obj.username && obj.password) {
      ctx.body = await this.userService.login(obj.username, obj.password)
      return
    }
    ctx.body = Result.argError()
  }
}

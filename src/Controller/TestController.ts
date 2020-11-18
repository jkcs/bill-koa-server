import { Controller, Get, Post, RequestMapping } from '@/core/decorator/ControllerDecorator'
import Log from '@/core/model/log/Log'
import { BaseContext } from 'koa'

@Controller
@RequestMapping()
export default class TestController {
  @Get('/get')
  public getSome (ctx: BaseContext) {
    Log.d('ces')
    ctx.body = {
      msg: '测试'
    }
  }

  @Post('/post')
  public postSome (ctx: any) {
    ctx.body = {
      msg: '测试'
    }
  }
}

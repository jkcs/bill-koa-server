import { Controller, Get, RequestMapping } from '@/core/decorator/ControllerDecorator'
import { UserRouterContext } from '@/types/UserRouterContext'
import Result from '@/src/utils/Result'
import { Auth } from '@/core/decorator/AuthDecorator'

@Controller
@RequestMapping('test')
export default class TestAuthController {
  @Auth
  @Get('/:id')
  public async test (ctx: UserRouterContext) {
    ctx.body = Result.success(await ctx.getUserInfo())
  }
}

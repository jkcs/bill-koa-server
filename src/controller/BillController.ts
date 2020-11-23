import { Controller, Get, RequestMapping } from '@/core/decorator/ControllerDecorator'
import { UserRouterContext } from '@/types/UserRouterContext'
import Result from '@/src/utils/Result'
import { AuthMapping } from '@/core/decorator/AuthDecorator'

/**
 * @author lw
 * @date 2020/11/23
 */
@Controller
@AuthMapping
@RequestMapping('bill')
export default class BillController {
  /**
   * 得到所有标签
   * @param ctx
   */
  @Get('/add')
  public async add (ctx: UserRouterContext) {
    ctx.body = Result.success([])
  }
}

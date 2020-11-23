import { Controller, Get, Post, RequestMapping } from '@/core/decorator/ControllerDecorator'
import { UserRouterContext } from '@/types/UserRouterContext'
import Result from '@/src/utils/Result'
import { AuthMapping } from '@/core/decorator/AuthDecorator'
import Decimal from 'decimal.js'
import { isNumber } from '@/src/utils/Utils'
import TagRemarksService from '@/src/service/TagRemarksService'
import { AutoWired } from '@/core/decorator/ContainerDecorator'
import Bill from '@/src/model/Bill'
import BillService from '@/src/service/BillService'
import { isStandardDate } from '@/src/utils/DateUtil'
import { BillSearchParams } from '@/types/MVC'

/**
 * @author lw
 * @date 2020/11/23
 */
@Controller
@AuthMapping
@RequestMapping('bill')
export default class BillController {
  @AutoWired
  private tagRemarksService: TagRemarksService
  @AutoWired
  private billService: BillService
  /**
   * 得到所有标签
   * @param ctx
   */
  @Post('/add')
  public async add (ctx: UserRouterContext) {
    const userId = ctx.getUserId()
    let { id, type, amount, tagId, tagRemarksId, remarks, billTime } = ctx.request.body
    const buildObj: any = { UserId: userId }
    if (![1, 0].includes(type)) {
      ctx.body = Result.argError()
      return
    }
    if (!isNumber(amount)) {
      ctx.body = Result.argError('金额必须为数值')
      return
    }
    if (!tagId) {
      ctx.body = Result.argError('请选择一个tag')
      return
    }
    if (!billTime || isStandardDate(billTime)) {
      ctx.body = Result.argError('请填写记账时间')
      return
    }
    if (remarks && !tagRemarksId) {
      await this.tagRemarksService.findOrCreateRemarks(tagId, userId, remarks.trim())
    }
    buildObj.id = id || undefined
    buildObj.type = type
    buildObj.billTime = billTime
    buildObj.amount = new Decimal(amount)
    ctx.body = Result.success(await this.billService.addBill(Bill.build(buildObj)))
  }

  @Get('/list')
  public async list (ctx: UserRouterContext) {
    const userId = ctx.getUserId()
    const { startTime, endTime, tagId, endId, size, type }: BillSearchParams = ctx.request.body

    const result = await this.billService.getBillList({
      userId, type, startTime, endTime, tagId, endId, size
    })
    ctx.body = Result.success(result)
  }
}

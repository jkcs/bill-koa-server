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
import { formatDate, getMonthSpanDate, isStandardDate } from '@/src/utils/DateUtil'
import { BillSearchParams, BillTrendGroup } from '@/types/MVC'
const xss = require('xss')
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
    const buildObj: any = { userId }
    let bill: Bill
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
    if (!billTime || !isStandardDate(billTime)) {
      ctx.body = Result.argError('请填写记账时间')
      return
    }
    if (remarks && !tagRemarksId) {
      const [tagRemarks] = await this.tagRemarksService.findOrCreateRemarks(tagId, userId, xss(remarks.trim()))
      buildObj.tagRemarksId = tagRemarks.id
    }
    buildObj.id = id || undefined
    buildObj.tagRemarksId = tagRemarksId || undefined
    buildObj.type = type
    buildObj.tagId = tagId
    buildObj.billTime = billTime
    buildObj.amount = new Decimal(amount)
    bill = await this.billService.addOrUpdateBill(Bill.build(buildObj))
    ctx.body = Result.success(bill)
  }

  @Post('/list')
  public async list (ctx: UserRouterContext) {
    const userId = ctx.getUserId()
    const { startTime, endTime, tagId, endId, size, type }: BillSearchParams = ctx.request.body

    const result = await this.billService.getBillList({
      userId, type, startTime, endTime, tagId, endId, size
    })
    ctx.body = Result.success(result)
  }

  @Get('/monthList')
  public async monthList (ctx: UserRouterContext) {
    const userId = ctx.getUserId()
    const { month } = ctx.query
    const { tagId, endId, size, type }: BillSearchParams = ctx.request.body
    let [startTime, endTime] = getMonthSpanDate(Number(month))
    startTime = formatDate(startTime)
    endTime = formatDate(endTime)
    const result = await this.billService.getBillList({
      userId, type, startTime, endTime, tagId, endId, size
    })
    ctx.body = Result.success(result)
  }

  @Post('/rank')
  public async rank (ctx: UserRouterContext) {
    const list = await this.billService.queryBillRank({
      userId: 1
    })
    ctx.body = Result.success(list)
  }

  @Post('/trend')
  public async trend (ctx: UserRouterContext) {
    const userId = ctx.getUserId()
    const { startTime, endTime, tagId, endId, size, type, group }: BillSearchParams = ctx.request.body
    if (!['days', 'weeks', 'months'].includes(group)) {
      ctx.body = Result.argError()
      return
    }
    const trend = await this.billService.queryBillTrend({
      userId, startTime, endTime, tagId, endId, size, type
    }, group)

    ctx.body = Result.success(trend)
  }
}

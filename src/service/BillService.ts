/**
 * @author lw
 * @date 2020/11/23
 */
import Bill from '@/src/model/Bill'
import { Op, QueryTypes, Sequelize } from 'sequelize'
import { BillResult, BillSearchParams, BillSumParams, BillTrendGroup } from '@/types/MVC'
import sequelize from '@/src/sequelize/index'
import { Service } from '@/core/decorator/ContainerDecorator'
import { injectModel, isBool } from '@/src/utils/Utils'
import { BillTrendName, BillTrendUnit, standardDate } from '@/src/utils/DateUtil'
import Decimal from 'decimal.js'
const moment = require('moment')

@Service
export default class BillService {
  async getById (id: number) {
    return await Bill.findByPk(id)
  }
  async addOrUpdateBill (bill: Bill) {
    if (bill.id) {
      injectModel(bill, await this.getById(bill.id))
    }
    return await bill.save()
  }

  async getBillList (params: BillSearchParams) {
    const { userId, tagId, startTime, endTime, endId, size, type } = params

    const result:BillResult[] = await sequelize.query(`
      SELECT
        b.id id,
        b.userId userId,
        b.type type,
        b.amount amount,
        b.tagId tagId,
        t.name tagName,
        t.icon tagIcon,
        tr.id tagRemarkId,
        tr.remark remark,
        b.billTime billTime,
        b.createdAt createdAt,
        b.updatedAt updatedAt
      FROM
        bill b 
        INNER JOIN tag t ON t.id = b.TagId
        LEFT JOIN tag_remarks tr ON tr.id = b.tagRemarksId
      WHERE
        b.userId = ${userId}
        ${tagId ? `AND b.tagId = ${tagId}` : ''}
        ${startTime ? `AND b.billTime>= '${startTime}'` : ''}
        ${endTime ? `AND b.billTime< '${endTime}'` : ''}
        ${isBool(type) ? `AND b.type = ${type}` : ''}
        ${Number(endId) ? `AND b.id < ${endId}` : ''}
      ORDER BY
        b.billTime DESC,
        b.createdAt DESC
        ${size ? `LIMIT ${size}` : ''}
    `, { type: QueryTypes.SELECT })
    return result
  }

  async countBillAmount (params: BillSumParams) {
    const { startTime, endTime, userId, tagId, type } = params
    const where: any = {
      userId,
      tagId: tagId || undefined,
      type: isBool(type) ? type : undefined,
      billTime: {}
    }
    if (startTime) where.billTime[Op.gte] = startTime
    if (endTime) where.billTime[Op.lt] = endTime
    return await Bill.findAll({
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('amount')), 'totalAmount']
      ],
      where
    })
  }

  async queryBillTrend (params: any, group: BillTrendGroup) {
    const { startTime, endTime } = params
    let ranks: object[] = await this.queryBillRank(params)
    // 按group切片
    const startMoment = moment(startTime)
    const endMoment = moment(endTime)
    const duration = endMoment.diff(startMoment, group)
    const charts: any[] = []
    let sum = new Decimal(0)
    let average: Decimal
    for (let i = 0; i <= duration; i++) {
      const name = startMoment.format(BillTrendName[group])
      const groupValue = startMoment.format(standardDate)
      charts.push({
        name,
        value: new Decimal(0),
        group,
        groupValue
      })
      startMoment.add(1, BillTrendUnit[group])
    }
    ranks.forEach((item:BillResult) => {
      sum = sum.plus(item.amount)
      const findIndex = charts.findIndex(c => c.groupValue === moment(item.billTime).format(standardDate))
      if (findIndex !== -1) {
        charts[findIndex].value = charts[findIndex].value.plus(item.amount)
      }
    })
    average = sum.div(duration).toDP(2)
    return {
      charts, ranks, sum, average
    }
  }

  async queryBillRank (params: any) {
    const { startTime, endTime, userId, tagId, type } = params
    const where: any = {
      userId,
      tagId: tagId || undefined,
      type: isBool(type) ? type : undefined,
      billTime: {}
    }
    if (startTime) where.billTime[Op.gte] = startTime
    if (endTime) where.billTime[Op.lt] = endTime
    return await sequelize.query(`
    SELECT
        b.id id,
        b.userId userId,
        b.type type,
        b.amount amount,
        b.tagId tagId,
        t.name tagName,
        t.icon tagIcon,
        tr.id tagRemarkId,
        tr.remark remark,
        b.billTime billTime,
        b.createdAt createdAt,
        b.updatedAt updatedAt
      FROM
        bill b 
        INNER JOIN tag t ON t.id = b.TagId
        LEFT JOIN tag_remarks tr ON tr.id = b.tagRemarksId
      WHERE
        b.userId = ${userId}
        ${tagId ? `AND b.tagId = ${tagId}` : ''}
        ${startTime ? `AND b.billTime>= '${startTime}'` : ''}
        ${endTime ? `AND b.billTime< '${endTime}'` : ''}
        ${isBool(type) ? `AND b.type = ${type}` : ''}
      ORDER BY
        b.amount DESC`, { type: QueryTypes.SELECT })
  }
}

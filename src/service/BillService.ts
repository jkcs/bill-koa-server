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
import {formatDate} from "@/src/utils/DateUtil"
import Decimal from "decimal.js"

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
        INNER JOIN tag_remarks tr ON tr.id = t.id
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

  async queryTrendBill (params: any) {
    return ''
  }

  async queryBillTrend (params: any, group: BillTrendGroup) {
    let ranks: object[] = await this.queryBillRank(params)
    if (group === 'week') {
      // 按日切片
      const charts: any[] = []
      ranks.forEach((item:BillResult) => {
        let findIndex = charts.findIndex(item => item.groupValue === item.billTime)
        if (findIndex !== -1) {
          charts[findIndex].amount = charts[findIndex].amount.plus(item.amount)
        } else {
          charts.push({
            name: formatDate(item.billTime, 'MM-DD'),
            value: new Decimal(item.amount),
            group: group,
            groupValue: item.billTime
          })
        }

      })
      // ranks.
    }
    // console.log(ranks)
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
    return await sequelize.query(`SELECT
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
        INNER JOIN tag_remarks tr ON tr.id = t.id
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

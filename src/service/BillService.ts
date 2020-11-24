/**
 * @author lw
 * @date 2020/11/23
 */
import Bill from '@/src/model/Bill'
import { Op, QueryTypes } from 'sequelize'
import { BillResult, BillSearchParams } from '@/types/MVC'
import sequelize from '@/src/sequelize/index'
import { Service } from '@/core/decorator/ContainerDecorator'
import { isBool, isNumber } from '@/src/utils/Utils'

@Service
export default class BillService {
  async addBill (bill: Bill) {
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
}

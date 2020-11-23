/**
 * @author lw
 * @date 2020/11/23
 */
import Bill from '@/src/model/Bill'
import { Op, QueryTypes } from 'sequelize'
import { BillResult, BillSearchParams } from '@/types/MVC'
import sequelize from '@/src/sequelize/index'

export default class BillService {
  async addBill (bill: Bill) {
    return await bill.save()
  }

  async getBillList (params: BillSearchParams) {
    const { userId, tagId, startTime, endTime, endId, size, type } = params

    const result:BillResult[] = await sequelize.query(`
      SELECT
        b.id id,
        b.UserId userId,
        b.type type,
        b.amount amount,
        b.TagId tagId,
        t.name tagName,
        t.icon tagIcon,
        tr.id tagRemarkId,
        tr.remark remark,
        b.billTime billTime
      FROM
        bill b 
        INNER JOIN tag t ON t.id = b.TagId
        INNER JOIN tag_remarks tr ON tr.id = t.id
      WHERE
        b.UserId = ${userId}
        ${tagId ? `AND b.TagId = ${tagId}` : ''}
        ${startTime ? `AND b.billTime BETWEEN ${startTime} AND ${endTime}` : ''}
        ${type ? `AND b.type = ${type}` : ''}
        ${endId ? `AND b.id > ${endId}` : ''}
      ORDER BY
        b.billTime DESC
        ${size ? `LIMIT ${size}` : ''}
    `, { type: QueryTypes.SELECT })
    return result
    // return await Bill.findAll({
    //   where: {
    //     UserId: userId,
    //     TagId: tagId,
    //     billTime: {
    //       [Op.between]: [startTime, endTime]
    //     },
    //     type: type || undefined,
    //     id: {
    //       [Op.gt]: endId || 0
    //     }
    //   },
    //   order: [
    //     ['billTime', 'DESC']
    //   ],
    //   limit: size || undefined
    // })
  }
}

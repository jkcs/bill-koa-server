import { Decimal } from 'decimal.js'
import { Model } from 'sequelize'
/**
 * @author lw
 * @date 2020/11/23
 */
declare namespace MVC {
  export abstract class BaseUserModel<StateT = any, CustomT = {}> extends Model<StateT, CustomT> {
    userId?: number
  }
  export type BillSearchParams = {
    userId: number,
    startTime?: Date,
    type?: 1|0,
    endTime?: Date,
    tagId?: number,
    endId?: number,
    size?: number
  }
  export type BillSumParams = {
    startTime?: Date,
    endTime?: Date,
    userId: number,
    tagId?: number,
    type?: 0|1
  }
  export type BillResult = {
    id: number,
    userId: number,
    type: 1|0,
    amount: Decimal,
    tagId: number,
    billTime: string,
    tagName: string,
    tagIcon: string,
    tagRemarkId: number,
    remark: string,
    createdAt: string,
    updatedAt: string
  }

  export type ChartItem = {
    name: string,
    value: any,
    group: string,
    groupValue: string
  }

  export type BillTrendGroup = 'week'|'month'|'year'

  export type BillTrendResult = {
    average: Decimal,
    sum: Decimal,
    ranks: BillResult[],
    charts: ChartItem[]
  }
}

export = MVC;

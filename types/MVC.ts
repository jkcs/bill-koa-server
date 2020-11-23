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
  export type BillResult = {
    id: number,
    userId: number,
    type: 1|0,
    amount: Decimal,
    tagId: number,
    tagName: string,
    tagIcon: string,
    tagRemarkId: number,
    remark: string
  }
}

export = MVC;

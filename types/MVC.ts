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
  export type BillParams = {
    id?: number,
    userId?: number,
    type: 1 | 0,
    amount: string | Decimal,
    tagId: number,
    tagRemark?: string,
    tagRemarkId?: number
  }
}

export = MVC;

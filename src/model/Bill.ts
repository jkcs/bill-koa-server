import { DataTypes, Model, Sequelize } from 'sequelize'
import sequelize from '@/src/sequelize/index'
import Tag from '@/src/model/Tag'
import User from '@/src/model/User'
import { Decimal } from 'decimal.js'

class Bill extends Model {
  id: number
  type: number
  amount: Decimal
  billTime: string|Date
}

Bill.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  type: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '1 出账 0 入账'
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    comment: '金额'
  },
  billTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.fn('NOW'),
    // defaultValue: Sequelize.NOW,
    comment: '账生成时间'
  }
}, { sequelize })

Bill.belongsTo(Tag, { foreignKey: 'tagId' })
Bill.belongsTo(User, { foreignKey: 'userId' })

export default Bill

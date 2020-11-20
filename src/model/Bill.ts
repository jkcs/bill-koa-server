import { DataTypes, Model } from 'sequelize'
import sequelize from '@/src/sequelize/index'
import Tag from '@/src/model/Tag'
import User from '@/src/model/User'

class Bill extends Model {
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
  }
}, { sequelize })

Bill.belongsTo(Tag)
Bill.belongsTo(User)

export default Bill

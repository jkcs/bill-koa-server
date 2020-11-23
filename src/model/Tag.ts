import sequelize from '@/src/sequelize/index'
import { DataTypes, Model } from 'sequelize'

class Tag extends Model {
  id: number
  name: string
  icon: string
  type: 1|0
}

Tag.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: '标签名称'
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '标签图标'
  },
  type: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '1 支出tag 0 收入tag'
  }
}, { sequelize })

export default Tag

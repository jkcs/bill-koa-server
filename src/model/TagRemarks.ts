import sequelize from '@/src/sequelize/index'
import { DataTypes, Model } from 'sequelize'
import User from '@/src/model/User'
import Tag from '@/src/model/Tag'

class TagRemarks extends Model {
  id: number
  remark: string
}

TagRemarks.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  remark: {
    type: DataTypes.STRING(30),
    comment: '类型4备注'
  }
}, { sequelize, tableName: 'tag_remarks' })

TagRemarks.belongsTo(User)
TagRemarks.belongsTo(Tag)

export default TagRemarks

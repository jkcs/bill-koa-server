import { DataTypes, Model } from 'sequelize'
import sequelize from '@/src/sequelize'
import Log from '@/core/model/log/Log'

class Tag extends Model {
}

Log.d('tag inject')
Tag.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tagName: {
    type: DataTypes.STRING
  }
}, { sequelize })

export default Tag

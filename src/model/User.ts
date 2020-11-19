import { DataTypes, Model } from 'sequelize'
import sequelize from '@/src/sequelize'
import Log from '@/core/model/log/Log'
import Tag from '@/src/model/Tag'

class User extends Model {
}

Log.d('user inject')
User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING
  },
  avatarId: {
    type: DataTypes.INTEGER
  },
  gender: {
    type: DataTypes.BOOLEAN
  },
  loginName: {
    type: DataTypes.STRING
  },
  usersSecurityId: {
    type: DataTypes.INTEGER
  }
}, { sequelize })

User.hasMany(Tag)

export default User

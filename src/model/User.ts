import { DataTypes, Model } from 'sequelize'
import sequelize from '@/src/sequelize'

class User extends Model {
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    comment: '用户名'
  },
  password: {
    type: DataTypes.STRING,
    comment: '密码'
  },
  avatar: {
    type: DataTypes.STRING(500),
    comment: '用户头像地址'
  },
  gender: {
    type: DataTypes.BOOLEAN,
    comment: '性别 1 男 0 女'
  },
  loginName: {
    type: DataTypes.STRING,
    comment: '登录名',
    unique: true
  }
}, { sequelize })

export default User

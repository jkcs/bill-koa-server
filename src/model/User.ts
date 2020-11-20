import sequelize from '@/src/sequelize/index'
import { DataTypes, Model } from 'sequelize'

class User extends Model {
  public id: number
  public createdAt: Date
  public updatedAt: Date
  public hash:string
  public username:string
  public password:string
  public avatar:string
  public gender:number
  public loginName:string
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  hash: {
    type: DataTypes.STRING(64),
    comment: '未登录用户唯一标识 (根据设备唯一标识生成，或为临时sessionId)'
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

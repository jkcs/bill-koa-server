import { Sequelize } from 'sequelize'
import Log from '@/core/model/log/Log'
import YamlParse from '@/core/model/parse/YamlParse'
// const { resolve } = require('path')
// const glob = require('glob')
let sequelize: Sequelize = null

export default (function async () {
  if (sequelize) return sequelize
  const host: string = YamlParse.Instance.getValue('db.host')
  const port: number = YamlParse.Instance.getValue('db.port')
  const database: string = YamlParse.Instance.getValue('db.database')
  const username: string = YamlParse.Instance.getValue('db.username')
  const password: string = YamlParse.Instance.getValue('db.password')

  sequelize = new Sequelize(database, username, password, {
    host: host,
    port: port,
    dialect: 'mysql', /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
    define: {
      freezeTableName: true
    },
    logging: Log.jdbc
  })

  sequelize.authenticate()
    .then(r => {
      Log.i('MySQL connection succeeded')
      const isProduction = process.env.NODE_ENV === 'production'
      sequelize.sync({ alter: isProduction, force: !isProduction })
      Log.i(`sync ${database} tables...`)
    }).catch(error => {
      Log.e(`Unable to connect to the database:${error}`)
    })
  return sequelize
})()

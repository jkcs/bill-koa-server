import { Sequelize } from 'sequelize'
import Log from '@/core/model/log/Log'
import YamlParse from '@/core/model/parse/YamlParse'
const { resolve } = require('path')
let sequelize: Sequelize = null
const glob = require('glob')

export default (function () {
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
      const pattern = resolve(__dirname, 'model', './**/*.{js,ts}')
      Log.i(`start sync ${database} tables...`)
      glob.sync(pattern)
        .forEach((item: any) => {
          require(item).default.sync({ alter: true })
        })
      Log.i('sync tables finished')
    }).catch(error => {
      Log.e(`Unable to connect to the database:${error}`)
    })
  return sequelize
})()

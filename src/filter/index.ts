import Result from '@/src/utils/Result'
import { ValidationError, UniqueConstraintError } from 'sequelize'
import Log from '@/core/model/log/Log'

/**
 * 所有过滤器都在此注册
 * TODO: 防sql注入过滤器
 */
const ExceptionFilter = require('./ExceptionFilter')
const AuthFilter = require('./AuthFilter')

const filter = async (ctx: any, next: any) => {
  try {
    await AuthFilter(ctx, next)
    await ExceptionFilter(ctx, next)
  } catch (e) {
    if (e.errno) {
      ctx.body = Result.exception(e)
    } else {
      if (e instanceof UniqueConstraintError) {
        ctx.body = Result.exception(e, '数据已存在，请勿重复添加！')
      } else if (e instanceof ValidationError) {
        ctx.body = Result.exception(e,
          process.env.NODE_ENV !== 'production'
            ? e.name + e.message
            : '校验数据失败！')
      } else {
        // 对接口异常进行捕获
        ctx.body = Result.unknownError()
      }
    }
    if (process.env.NODE_ENV !== 'production') {
      Log.e(e.parent && e.parent.sqlMessage)
      Log.e('post args ' + JSON.stringify(ctx.request.body))
      Log.e(e.name, e.message)
    }
  }
}

export default filter

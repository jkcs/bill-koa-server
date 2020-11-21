import Result from '@/src/utils/Result'
import { ValidationError } from 'sequelize'
import Log from '@/core/model/log/Log'

/**
 * 所有过滤器都在此注册
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
      if (e instanceof ValidationError) {
        ctx.body = Result.exception(e, e.name + e.message)
      } else {
        // 对接口异常进行捕获
        ctx.body = Result.unknownError()
      }
    }
    if (process.env.NODE_ENV !== 'production') {
      Log.e('post args ' + JSON.stringify(ctx.request.body))
      Log.e(e.name, e.message)
    }
  }
}

export default filter

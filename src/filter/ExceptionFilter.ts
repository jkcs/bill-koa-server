/**
 * 全局异常捕获
 */

import Result from '../utils/Result'
import Log from '@/core/model/log/Log'
import { ValidationError } from 'sequelize'
// 异常拦截器
module.exports = async (ctx: any, next: any) => {
  try {
    await next()
    // 对 404 状态码处理
    if (ctx.response.status === 404) {
      ctx.body = Result.noFoundError()
    }
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

/**
 * 所有过滤器都在此注册
 */
const ExceptionFilter = require('./ExceptionFilter')
const AuthFilter = require('./AuthFilter')

const filter = async (ctx: any, next: any) => {
  await AuthFilter(ctx, next)
  await ExceptionFilter(ctx, next)
}

export default filter

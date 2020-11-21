import Result from '../utils/Result'
// 异常拦截器
module.exports = async (ctx: any, next: any) => {
  await next()
  // 对 404 状态码处理
  if (ctx.response.status === 404) {
    ctx.body = Result.noFoundError()
  }
}

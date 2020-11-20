import ErrorCode from '../constants/ErrorCode'

export default class Result {
  private code: number
  private msg: string
  private data: any

  constructor (code?: number, msg?: string, data?: any) {
    this.code = code
    this.data = data
    this.msg = msg
  }

  toString () {
    return this
  }

  public static success (data?: any, msg?: string) {
    return new Result(ErrorCode.SUCCESS, msg, data)
  }

  public static error (msg?: any) {
    return new Result(ErrorCode.ERROR, msg)
  }

  public static exception (error: NodeJS.ErrnoException) {
    return new Result(error.errno || ErrorCode.EXCEPTION, error.message)
  }

  public static argError () {
    return new Result(ErrorCode.ARG_ERROR, '参数异常！')
  }

  public static unknownError () {
    return new Result(ErrorCode.UNKNOWN_EXCEPTION, '系统异常，请稍后重试！')
  }

  public static noFoundError (msg?: string) {
    return new Result(ErrorCode.NOT_FOUND_ERROR, msg || '404 未找到该接口')
  }
}

import Constants from '@/src/constants/ErrorCode'

export default class TokenInvalidException implements NodeJS.ErrnoException {
  code: string
  errno: number = Constants.TOKEN_INVALID
  message: string = '状态异常，请尝试重新登录后重试'
  name: string
  path: string
  stack: string
  syscall: string
  constructor (msg?:string) {
    if (msg) this.message = msg
  }
}

import Constants from '@/src/constants/ErrorCode'

export default class BusinessException implements NodeJS.ErrnoException {
  code: string
  errno: number = Constants.BUSINESS_EXCEPTION
  message: string = '业务操作异常 ！'
  name: string = 'BusinessException'
  path: string
  stack: string
  syscall: string
  constructor (msg?:string) {
    if (msg) this.message = msg
  }
}

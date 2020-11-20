import Constants from '@/src/constants/ErrorCode'

export default class CantNotUpdateException implements NodeJS.ErrnoException {
  code: string
  errno: number = Constants.CAN_NOT_UPDATE_EXCEPTION
  message: string = '没有任何可更新项'
  name: string = 'CantNotUpdateException'
  path: string
  stack: string
  syscall: string
  constructor (msg?:string) {
    if (msg) this.message = msg
  }
}

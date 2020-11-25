import Constants from '@/src/constants/ErrorCode'

/**
 * @author lw
 * @date 2020/11/25
 */
export default class SQLInjectException implements NodeJS.ErrnoException {
  code: string
  errno: number = Constants.SQL_INJECT_EXCEPTION
  message: string = '你不乖哦。'
  name: string = 'SQLInjectException'
  path: string
  stack: string
  syscall: string
  constructor (msg?:string) {
    if (msg) this.message = msg
  }
}

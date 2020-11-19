// @ts-ignore
import { configure, getLogger } from 'log4js'

configure({
  appenders: {
    out: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: '%[[%d{yyyy-MM-dd hh:mm:ss}] [%p] %m'
      }
    }
  },
  categories: {
    default: {
      appenders: ['out'],
      level: process.env.NODE_ENV === 'production'
        ? 'info'
        : 'debug'
    }
  }
})
const logger = getLogger()
export default class Log {
  static log4: any = logger

  static jdbc (message: any) {
    if (process.env.NODE_ENV === 'production') {
      Log.log4.info(String(message))
      return
    }
    Log.log4.debug(String(message))
  }

  static e (message: any, ...args: any[]) {
    Log.log4.error(message, ...args)
  }

  static w (message: any, ...args: any[]) {
    Log.log4.warn(message, ...args)
  }

  static d (message: any, ...args: any) {
    Log.log4.debug(message, ...args)
  }

  static t (message: any, ...args: any[]) {
    Log.log4.trace(message, ...args)
  }

  static i (message: any, ...args: any[]) {
    Log.log4.info(message, ...args)
  }

  static f (message: any, ...args: any[]) {
    Log.log4.fatal(message, ...args)
  }
}

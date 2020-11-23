import { Model } from 'sequelize'
import Decimal from 'decimal.js'

const typeObj: any = {
  Array: 'Array',
  Object: 'Object',
  String: 'String',
  Number: 'Number',
  Undefined: void 0
}
export function cached (fn: Function): Function {
  const cache = Object.create(null)
  return function cachedFn (str: string): any {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

export function injectObj (model: Model, obj: any) {
  if (isEmpty(obj)) {
    return
  }
  Object.keys(obj).forEach(k => {
    model.setDataValue(k, obj[k])
  })
}

export function injectModel (target: Model, model: Model) {
  injectObj(target, model.get())
}

export const isEmpty = (arg: any): boolean => {
  switch (_toString(arg)) {
    case typeObj.String:
      return !arg.length
    case typeObj.Array:
      return isEmptyArray(arg)
    case typeObj.Object:
      return isEmptyObject(arg)
    case typeObj.Undefined:
      return true
    default:
      return arg === 0
        ? false
        : !arg
  }
}

export const isNumber = (num: any): boolean => {
  if (num instanceof Decimal) return true
  return !isNaN(num) && _toString(num) === typeObj.Number
}

export const isEmptyArray = (arr: any[]): boolean => {
  return arr.length === 0
}

export const isEmptyObject = (obj: Object): boolean => {
  return Object.keys(obj).length === 0
}

export const _toString = (arg: any): string => {
  return Object.prototype.toString.call(arg).slice(8, -1)
}

export const isObject = (arg: any): boolean => {
  return _toString(arg) === typeObj.Object
}

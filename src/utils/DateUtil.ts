import { isNumber } from '@/src/utils/Utils'

let moment = require('moment')
export const standardDate = 'YYYY-MM-DD'
export const standardWeek = 'YYYY-MM-ww'
export const standardTime = 'HH:mm:ss'
export const standard = standardDate + ' ' + standardTime

export const BillTrendName = {
  'days': 'MM-DD',
  'weeks': 'D',
  'months': 'M月'
}

export const BillTrendGroupValeStandard = {
  'days': standardDate,
  'weeks': standardWeek,
  'months': 'YYYY-MM'
}

export const BillTrendUnit = {
  'days': 'day',
  'weeks': 'week',
  'months': 'month'
}

export function isStandardDate (str: string) {
  try {
    return moment(str).isValid()
  } catch (e) {
    throw e
  }
}

export function formatDate (inp: any, formatStr?: string) {
  return moment(inp).format(formatStr || standard)
}

export function getMonthSpanDate (month?: number):[Date, Date] {
  const now = new Date()
  if (month && isNumber(month)) now.setMonth(month - 1)
  now.setDate(1)
  now.setHours(0)
  now.setMinutes(0)
  now.setSeconds(0)
  const startTime = now.getTime()
  now.setMonth(now.getMonth() + 1)
  return [new Date(startTime), now]
}

export function getYearMonthSpanDate (year:number, month?:number):[Date, Date] {
  const now = new Date()
  if (year && isNumber(year)) {
    now.setFullYear(year)
    now.setMonth(0)
  }
  if (month && isNumber(month)) now.setMonth(Number(month) - 1)
  now.setDate(1)
  now.setHours(0)
  now.setMinutes(0)
  now.setSeconds(0)
  const startTime = now.getTime()
  now.setMonth(now.getMonth() + 12)
  return [new Date(startTime), now]
}

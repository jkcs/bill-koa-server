// import moment from 'moment'
import { isNumber } from '@/src/utils/Utils'

let moment = require('moment')
export const standardDate = 'YYYY-MM-DD'
export const standardTime = 'HH:mm:ss'
export const standard = standardDate + ' ' + standardTime
export function isStandardDate (str: string) {
  try {
    return moment(str).isValid()
  } catch (e) {
    throw e
  }
}

export function formatDate (date: Date) {
  return moment(date).format(standard)
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

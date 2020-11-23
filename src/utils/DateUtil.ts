import moment from 'moment'
export const standardDate = 'YYYY-MM-DD'
export const standardTime = 'HH:mm:ss'
export const standard = standardDate + ' ' + standardTime
export function isStandardDate (str: string) {
  try {
    return !!moment(str, standardDate)
  } catch (e) {
    throw e
  }
}

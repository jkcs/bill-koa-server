const sha = require('sha.js')

export function hash (str: string) {
  return sha('sha256').digest('hex')
}

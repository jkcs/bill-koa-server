import Constant from '../constants/Constant'
const CryptoJS = require('crypto-js')

export function hash (str: string) {
  return CryptoJS.SHA256(str).toString()
}

export function encrypt (str: string): string {
  return CryptoJS.AES.encrypt(str, Constant.SECRET).toString()
}

export function decrypt (str: string): string {
  return CryptoJS.AES.decrypt(str, Constant.SECRET).toString(CryptoJS.enc.Utf8)
}

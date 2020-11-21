import { cached } from '@/src/utils/Utils'
import ControllerContainer from '@/core/model/container/ControllerContainer'

export default class AuthRouterSet {
  public static readonly _instance: AuthRouterSet = new AuthRouterSet()
  public readonly set: any = new Set()
  public readonly cachedFn = cached(this.isMatch.bind(this))

  public static get Instance (): AuthRouterSet {
    return AuthRouterSet._instance
  }

  push (prefix: string): void {
    this.set.add(prefix)
  }

  has (prefix: string): boolean {
    return this.cachedFn(prefix)
  }

  rebuildPathToArr (url: string) {
    const arr = url.charCodeAt(0) === 0x47
      ? url.split('/')
      : url.split('/').slice(1)

    return arr.filter(str => str !== '')
  }

  isMatch (realPath: string): boolean {
    if (this.set.has(realPath)) {
      return true
    }
    const list = [...this.set]
    for (let i = 0; i < list.length; i++) {
      const path = list[i]
      const authPathArr = this.rebuildPathToArr(path)
      const realPathArr = this.rebuildPathToArr(realPath)
      if (authPathArr.length === realPathArr.length && this.isPathContain(authPathArr, realPathArr)) {
        return true
      }
    }

    return false
  }

  isPathContain (arr1: string[], arr2: string[]): boolean {
    let flag = true
    for (let j = 0; j < arr1.length; j++) {
      const a1 = arr1[j]
      const a2 = arr2[j]
      if (a1 === a2) continue
      if (a1.indexOf('*') !== -1) continue
      if (a1.indexOf(':') !== -1) continue
      flag = false
    }
    return flag
  }

  buildAllPath () {
    const map = ControllerContainer.routerMap
    const basePrefix = ControllerContainer.prefix
    for (const [, router] of map.entries()) {
      const weakMap = Reflect.getMetadata(`routes`, router)
      let prefix = basePrefix + router.controllerPrefix
      for (const [, val] of weakMap.entries()) {
        if (val.isAuth) this.push(prefix + val.url)
      }
    }
  }
}

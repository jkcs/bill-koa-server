import { cached } from '@/src/utils/Utils'
import ControllerContainer from '@/core/model/container/ControllerContainer'

export default class AuthRouterSet {
  public static readonly _instance: AuthRouterSet = new AuthRouterSet()
  set: any = new Set()

  public static get Instance (): AuthRouterSet {
    return AuthRouterSet._instance
  }

  push (prefix: string): void{
    this.set.add(prefix)
  }

  has (prefix: string): void{
    return cached(this.set.has)(prefix)
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

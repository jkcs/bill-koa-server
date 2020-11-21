import { cached } from '@/src/utils/Utils'

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
}

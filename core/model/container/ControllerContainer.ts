import { Value } from '../../decorator/YamlDecorator'
import AuthPathContainer from "@/core/model/container/AuthPathContainer"
const cuid = require('cuid')
const compose = require('koa-compose')

/**
 * 路由容器
 */
export default class ControllerContainer {
  @Value('koa.prefix')
  public static prefix: string
  public static routerMap: any = new Map()

  static createRouter<T> (routerName: string): any {
    if (routerName && !ControllerContainer.hasRouter(routerName)) {
      const router = require('koa-router')()
      Reflect.defineMetadata(`uid`, cuid(), router)
      Reflect.defineMetadata(`routes`, new Map(), router)
      ControllerContainer.routerMap.set(routerName, router)
    }
  }

  static hasRouter (routerName: string): boolean {
    return ControllerContainer.routerMap.has(routerName)
  }

  static deleteRouter (routerName: string): boolean {
    return ControllerContainer.routerMap.delete(routerName)
  }

  static getRouter<T> (routerName: string): T {
    this.createRouter(routerName)
    return ControllerContainer.routerMap.get(routerName)
  }

  static exportRouter (): any {
    let routers: any[] = []
    ControllerContainer.routerMap.forEach(function (router: any) {
      router.prefix(ControllerContainer.prefix + router.controllerPrefix)
      routers.push(router.routes())
      routers.push(router.allowedMethods())
    })
    return compose(routers)
  }
}

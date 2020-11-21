import ControllerContainer from '../model/container/ControllerContainer'

export function Controller (target: any) {
  ControllerContainer.createRouter(target.name)
}

export function RequestMapping (controllerPrefix?: string) {
  return function (target: any) {
    const router:any = ControllerContainer.getRouter(target.name)
    if (controllerPrefix) {
      let firstChar = controllerPrefix.substr(0, 1)
      if (firstChar !== '/') {
        controllerPrefix = '/' + controllerPrefix
      }
    }
    router.controllerPrefix = controllerPrefix || '/'
  }
}

export function Get (url: string) {
  return function <T> (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
    // 保存原函数
    const fn: any = descriptor.value
    const router: any = ControllerContainer.getRouter(target.constructor.name)
    Reflect.getMetadata(`routes`, router).set(propertyKey, { url })
    router.get(url, fn.bind(target))
  }
}

export function Post (url: string) {
  return function <T> (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
    // 保存原函数
    let fn: any = descriptor.value
    let router: any = ControllerContainer.getRouter(target.constructor.name)
    Reflect.getMetadata(`routes`, router).set(propertyKey, { url })
    router.post(url, fn.bind(target))
  }
}

export function Put (url: string) {
  return function <T> (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
    // 保存原函数
    let fn: any = descriptor.value
    let router: any = ControllerContainer.getRouter(target.constructor.name)
    Reflect.getMetadata(`routes`, router).set(propertyKey, { url })
    router.put(url, fn.bind(target))
  }
}

export function Delete (url: string) {
  return function <T> (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
    // 保存原函数
    let fn: any = descriptor.value
    let router: any = ControllerContainer.getRouter(target.constructor.name)
    Reflect.getMetadata(`routes`, router).set(propertyKey, { url })
    router.delete(url, fn.bind(target))
  }
}

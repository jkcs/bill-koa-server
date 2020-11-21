import ControllerContainer from '@/core/model/container/ControllerContainer'
import AuthPathContainer from '@/core/model/container/AuthPathContainer'

export function AuthMapping (target: any) {
  const router:any = ControllerContainer.getRouter(target.name)
  const prefix = ControllerContainer.prefix + router.controllerPrefix
  AuthPathContainer.Instance.push(prefix + '/**')
}

export function Auth<T> (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
  let router: any = ControllerContainer.getRouter(target.constructor.name)
  let newVar = Reflect.getMetadata(`routes`, router).get(propertyKey)
  newVar.isAuth = true
  Reflect.getMetadata(`routes`, router).set(propertyKey, newVar)
}

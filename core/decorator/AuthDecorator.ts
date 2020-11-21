import ControllerContainer from '@/core/model/container/ControllerContainer'
import AuthPathContainer from '@/core/model/container/AuthPathContainer'

export function AuthMapping (target: any) {
  const router:any = ControllerContainer.getRouter(target.name)
  const prefix = ControllerContainer.prefix + router.controllerPrefix
  AuthPathContainer.Instance.push(prefix)
}

export function Auth<T> (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
  let router: any = ControllerContainer.getRouter(target.constructor.name)
  Reflect.getMetadata(`routes`, router).get(descriptor)
  console.log(Reflect.getMetadata(`routes`, router), 12321321)
  console.log(Reflect.getMetadata(`routes`, router).get(descriptor))
  console.log(ControllerContainer.prefix + router.controllerPrefix)
  const prefix = ControllerContainer.prefix + router.controllerPrefix
  AuthPathContainer.Instance.push(prefix)
}

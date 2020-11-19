import BeanContainer from '../model/container/BeanContainer'

export function Component (target: any) {
  BeanContainer.Instance.createBean(target.name, target)
}

export function Service (target: any) {
  Component(target)
}

export function Manger (target: any) {
  Component(target)
}

export function Data (target: any) {
  Component(target)
}

export function AutoWired (target: any, propertyKey: string) {
  const className = Reflect.getMetadata('design:type', target, propertyKey).name
  target[propertyKey] = BeanContainer.Instance.getBean(className)
}

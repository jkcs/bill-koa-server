import 'reflect-metadata'
const cuid = require('cuid')

/**
 * bean容器
 */
export default class BeanContainer {
  public static readonly _instance: BeanContainer = new BeanContainer()
  map: any = new Map()

  public static get Instance (): BeanContainer {
    return BeanContainer._instance
  }

  createBean<T> (className: string, source: T): any {
    const beanInstance = new (<any>source)()
    Reflect.defineMetadata(`uid`, cuid(), beanInstance)
    this.map.set(className, beanInstance)
  }

  updateBean<T> (className: string, source: T): any {
    if (source != null) Reflect.defineMetadata(`uid`, cuid(), source)
    this.map.set(className, source)
  }

  destroyBean (className: string): boolean {
    this.updateBean(className, null)
    return this.map.delete(className)
  }

  getBean<T> (className: string): T {
    return this.map.get(className)
  }

  toString (): string {
    let tmp: string[] = []
    for (let [key, value] of this.map.entries()) {
      tmp.push(`[${key}, ${value}]`)
    }
    return tmp.join(',')
  }
}

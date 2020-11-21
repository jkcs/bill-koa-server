import { Value } from '../../decorator/YamlDecorator'
import { Manger } from '../../decorator/ContainerDecorator'
import Log from '../log/Log'
import LifeEventEmitter from '@/core/model/event/LifeEventEmitter'
const glob = require('glob')
const { resolve } = require('path')

// 包管理
@Manger
export default class PackageManage {
  @Value('package.scan')
  scanPackage: string
  @Value('package.exclude')
  excludePackage: string

  // 初始化扫描
  public initScan (rootDir: string) {
    Log.i('Start scanning packages')
    let pattern = resolve(rootDir, this.scanPackage)
    if (this.excludePackage) {
      pattern = resolve(pattern, `!(${this.excludePackage})`)
    }
    pattern = resolve(pattern, './**/**.{js,ts}')
    glob.sync(pattern)
      .forEach((item: any) => {
        require(item)
      })
    Log.i('Package scan complete!')
    LifeEventEmitter.onPackageScanComplete()
  }
}

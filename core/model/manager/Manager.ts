import PackageManage from './PackageManage'
import { AutoWired, Manger } from '../../decorator/ContainerDecorator'
// 总管理者
@Manger
export default class Manager {
  @AutoWired
  private packageManage: PackageManage

  public rootDir: string

  public init (rootDir: string): void {
    this.rootDir = rootDir
    this.packageManage.initScan(rootDir)
  }
}

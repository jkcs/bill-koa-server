import AuthPathContainer from '../container/AuthPathContainer'

export default class LifeEventEmitter {
  static onPackageScanComplete () {
    AuthPathContainer.Instance.buildAllPath()
  }
}

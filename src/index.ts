import CatchError from './lib/error'
import Performance from './lib/performace'
import Report, {reportType} from './lib/report'

class WatchMan {
  report: reportType
  catchError: object
  performance: object
  constructor (config ={}) {
    this.catchError = null
    this.report = null
    this.performance = null
    this.init(config)
  }
  private init (config) {
    this.catchError = new CatchError()
    this.performance = new Performance()
    this.report = new Report({interval: config.interval, url: config.url})
  }
  send (data) {
    Report.send(data)
  }
}

export default WatchMan

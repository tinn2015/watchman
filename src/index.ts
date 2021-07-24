import CatchError from './lib/error'
import Report, {reportType} from './lib/report'

class WatchMan {
  report: reportType
  catchError: object
  constructor (config ={}) {
    this.catchError = null
    this.report = null
    this.init(config)
  }
  private init (config) {
    this.catchError = new CatchError()
    this.report = new Report({interval: config.interval, url: config.url})
  }
  send (data) {
    Report.send(data)
  }
}

export default WatchMan

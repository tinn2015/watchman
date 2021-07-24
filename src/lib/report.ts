import {Error as ErrorType} from '../types/common' 

const sessionStorageName = 'WATCHMAN_REPORT_STASH'

export interface reportType {
  interval: number,
  timer: null | number,
  url: string
}

interface options {
  interval: number,
  url: string
}
class Report implements reportType {
  interval: number
  timer: number
  url: string
  constructor (options: options) {
    this.interval = options.interval || 10 * 60 * 1000
    this.url = options.url 
    this.timer = null
    if (this.url) {
      this.setReportInterval()
    }
  }

  static send (error: ErrorType) {
    let reportData = sessionStorage.getItem('sessionStorageName')
    let result: ErrorType[] = []
    if (!reportData) {
      result = [error]
    } else {
      let parseData = JSON.parse(reportData)
      parseData.push(error)
      result = parseData
    }
    sessionStorage.setItem(sessionStorageName, JSON.stringify(result))
  }

  private setReportInterval () {
    this.timer = window.setInterval(() => {
      let errorData = sessionStorage.getItem(sessionStorageName)
      if (errorData) {
        fetch(this.url, {
          body: errorData,
          method: 'POST'
        }).then(() => {
          console.log('watchman report success', sessionStorage.getItem(sessionStorageName))
        }).catch(() => {
          clearInterval(this.timer)
        })
        sessionStorage.removeItem(sessionStorageName)
      }
    }, this.interval)
  }

  // setInterval (time: number) {
  //   this.interval = time
  //   clearInterval(this.timer)
  //   this.setReportInterval()
  // }
}

export default Report

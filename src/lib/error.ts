import { getErrorType } from '../utils/index'
import { Error } from '../types/common'
import Report from './report'
/**
 * @description: 
 *
 * @param {*}
 * @return {*}
 */


class CatchError {
  constructor () {
    window.addEventListener('error', (err) => {
      this.handleError(err)
    }, true)
    // window.onerror = (message, source, lineno, colno, error) => {
    //   console.log('on error', message, source, lineno, colno, error)
    // }

    /**
     * @description: promise 被reject 被catch时触发
     * @param {*} 
     * @return {*}
     */    
    // window.onrejectionhandled = (e) => {
    //   console.log('promise onrejectionhandled', e)
    // }

    /**
     * @description: promise 被 reject 但是没有reject对应回掉时触发
     * @param {*} e
     * @return {*}
     */    
    window.onunhandledrejection = (e) => {
      this.handlePromiseError(e)
    }
  }

  private handleError (e) {
    // srcElement === window 是全局错误 否则是 资源加载错误
    const error:Error = {
      type: ''
    }
    if (e.srcElement === 'window') {  // global error
      error.message = e.srcElement.message
      error.type = getErrorType(error.message)
      error.lineno = error.lineno
      error.colno = error.colno
    } else {  // resource error
      error.type = 'ResourceError'
      error.tagName = e.srcElement.tagName
      if (error.tagName === 'IMG' || error.tagName === 'SCRIPT') {
        error.src = e.srcElement.src
      }
    }
    this.reportError(error)
  }

  private handlePromiseError (e) {
    const error: Error = {
      type: '',
      reason: {}
    }
    error.type = e.type
    error.reason = {
      message: e.reason.message,
      stack: e.reason.stack
    }
    Report.send(error)
  }

  private reportError (error) {
    Report.send(error)
  }
}


export default CatchError
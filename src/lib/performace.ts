class Performance {
  performance: {
    timing: {}
  }
  constructor () {
    // this.performance = window.performance
    window.addEventListener('load', () => {
      console.log('load')
      setTimeout(() => {
        this.timingHandle()
      }, 1000)
    })
  }
  timingHandle () {
    const timing = window.performance.timing
    const timingObj_net = {}
    const timingObj_dom = {}
    timingObj_net['DNS解析用时：'] = (timing.domainLookupEnd - timing.domainLookupStart) / 1000 + 's'
    timingObj_net['TCP完成握手用时：'] = (timing.connectEnd - timing.connectStart) / 1000 + 's'
    timingObj_net['HTTP请求响应完成用时：'] = (timing.responseEnd - timing.responseStart) / 1000 + 's'
    timingObj_net['网络总用时：'] = (timing.responseEnd - timing.navigationStart) / 1000 + 's'
    timingObj_dom['DOM解析完成用时：'] = (timing.domInteractive - timing.domLoading) / 1000 + 's'
    timingObj_dom['DOM解析完成且资源加载完成用时：'] = (timing.domComplete - timing.domLoading) / 1000 + 's'
    timingObj_dom['脚本加载用时：'] = (timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart) / 1000 + 's'
    timingObj_dom['onload事件用时：'] = (timing.loadEventEnd - timing.loadEventStart) / 1000 + 's'
    timingObj_dom['白屏时间：'] = (timing.domLoading - timing.navigationStart) / 1000 + 's'
    timingObj_dom['页面可交互用时：'] = (timing.domInteractive - timing.navigationStart) / 1000 + 's'
    timingObj_dom['页面总耗用时：'] = ((timing.loadEventEnd || timing.loadEventStart || timing.domComplete || timing.domLoading) - timing.navigationStart) / 1000 + 's'
    for(let key in timingObj_net) {
      console.log(`${key} ${timingObj_net[key]}`);
    }
    console.log('---------分割线---------')
    for(let key in timingObj_dom) {
      console.log(`${key} ${timingObj_dom[key]}`);
    }
  }
}

export default Performance
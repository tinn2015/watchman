# watchman
A lightweight performance monitoring error reporting plugin

# 使用说明
```js
import WatchMan from 'watchman-web'

const watchman = new WatchMan({
  url: 'localhost:3000/report' // 错误上报接口
  interval: 5000  // 上报频率
})

/* 手动上报 */
watchman.send({})
```

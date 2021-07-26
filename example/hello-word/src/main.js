import { createApp } from 'vue'
import App from './App.vue'
import WatchMan from 'watchman-web'
const watchman = new WatchMan({
  url: 'www.baidu.com/upload',
  interval: 5000
})

watchman.send({data: '', type: 'test'})

createApp(App).mount('#app')

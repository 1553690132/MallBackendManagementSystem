import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'default-passive-events'
import './plugins/element.js'
import './assets/css/global.css'
import plugins from './plugins'

Vue.use(plugins)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

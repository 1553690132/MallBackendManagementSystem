// 按需引入
import Vue from 'vue'
import { Form, FormItem, Input, Button, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// Message组件需要进行全局挂载
Vue.prototype.$message = Message
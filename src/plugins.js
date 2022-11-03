import axios from "axios"
import 'default-passive-events'
import './plugins/element.js'
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
// Vue的配置
export default {
    install(Vue, options) {
        Vue.config.productionTip = false

        Vue.component('breadcrumb', {
            props: ['title1', 'title2'],
            template: `<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>{{title1}}</el-breadcrumb-item>
  <el-breadcrumb-item>{{title2}}</el-breadcrumb-item></el-breadcrumb-item>
</el-breadcrumb>`,
        })

        axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"

        axios.interceptors.request.use(config => {
            // 添加 Authorization请求头为 token令牌
            config.headers.Authorization = sessionStorage.getItem('token')
            return config
        })

        Vue.prototype.$http = axios

        Vue.use(TreeTable)
    }
}
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Orders from '../components/order/Orders.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    {
      path: '/login', component: Login, beforeEnter(to, from, next) {
        sessionStorage.clear()
        next()
      }
    },
    {
      path: '/home', component: Home, redirect: { name: 'welcome' },
      children: [{
        path: 'welcome',
        name: 'welcome',
        component: Welcome
      }, {
        path: '/users',
        component: Users
      }, {
        path: '/orders',
        component: Orders
      }]
    },
  ]
})

// 全局路由守卫判断登录状态
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  if (!sessionStorage.getItem('token')) return next('/login')
  next()
})

export default router

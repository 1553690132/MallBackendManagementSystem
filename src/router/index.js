import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Orders from '../components/order/Orders.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Categories from '../components/goods/Categories.vue'
import Params from '../components/goods/Params.vue'
import GoodsList from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'

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
      }, {
        path: '/rights',
        component: Rights
      }, {
        path: '/roles',
        component: Roles
      }, {
        path: '/categories',
        component: Categories
      }, {
        path: '/params',
        component: Params
      }, {
        path: '/goods',
        component: GoodsList,
      }, {
        path: '/goods/add',
        component: Add
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

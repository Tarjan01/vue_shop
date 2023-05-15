import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '.././components/LoginView.vue'
import HomeView from '.././components/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: LoginView },
  { path: '/', redirect: '/login' },
  { path: '/home', component: HomeView }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to:将要访问的路径
  // from:从哪个路径跳转而来
  // next:函数，表示放行
  // next() 放行 next('/login') 强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router

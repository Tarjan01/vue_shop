import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '.././components/LoginView.vue'
import HomeView from '.././components/HomeView.vue'
import WelcomeView from '.././components/WelcomeView.vue'
import UsersView from '.././components/user/UsersView.vue'
import RightsView from '.././components/power/RightsView.vue'
import RolesView from '.././components/power/RolesView.vue'
import CateView from '.././components/goods/CateView.vue'
import ParamsView from '.././components/goods/ParamsView.vue'
import GoodsList from '.././components/goods/ListView.vue'
import AddView from '.././components/goods/AddView.vue'
import OrderView from '.././components/order/OrderView.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: LoginView },
  { path: '/', redirect: '/login' },
  {
    path: '/home',
    component: HomeView,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: WelcomeView },
      { path: '/users', component: UsersView },
      { path: '/rights', component: RightsView },
      { path: '/roles', component: RolesView },
      { path: '/categories', component: CateView },
      { path: '/params', component: ParamsView },
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: AddView },
      { path: '/orders', component: OrderView }
    ]
  }
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

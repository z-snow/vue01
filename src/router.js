import Vue from 'vue'
import Router from 'vue-router'
const login = () => import(/* webpackChunkName:"login_home_welcome" */ './components/login.vue')
// import Login from './components/Login.vue'
const home = () => import(/* webpackChunkName:"login_home_welcome" */ './components/home.vue')
// import home from './components/home.vue'
const welcome = () => import(/* webpackChunkName:"login_home_welcome" */ './components/welcome.vue')
// import welcome from './components/welcome.vue'
const user = () => import(/* webpackChunkName:"user" */ './components/users/user.vue')
// import user from './components/users/user.vue'
const rights = () => import(/* webpackChunkName:"power" */ './components/power/rights.vue')
// import rights from './components/power/rights.vue'
const roles = () => import(/* webpackChunkName:"power" */ './components/power/roles.vue')
// import roles from './components/power/roles.vue'
const cate = () => import(/* webpackChunkName:"goods" */ './components/goods/cate.vue')
// import cate from './components/goods/cate.vue'
const params = () => import(/* webpackChunkName:"goods" */ './components/goods/params.vue')
// import params from './components/goods/params.vue'
const list = () => import(/* webpackChunkName:"goods" */ './components/goods/list.vue')
// import list from './components/goods/list.vue'
const add = () => import(/* webpackChunkName:"goods" */ './components/goods/add.vue')
// import add from './components/goods/add.vue'
const order = () => import(/* webpackChunkName:"order" */ './components/order/order.vue')
// import order from './components/order/order.vue'
const report = () => import(/* webpackChunkName:"report" */ './components/report/report.vue')
// import report from './components/report/report.vue'

Vue.use(Router)
const router = new Router({
  // 配置登录的路径
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/home',
      component: home,
      redirect:'/welcome',
      children:[
        {path:'/welcome',component:welcome},
        {path:'/users',component:user},
        {path:'/rights',component:rights},
        {path:'/roles',component:roles},
        {path:'/categories',component:cate},
        {path:'/params',component:params},
        {path:'/goods',component:list},
        {path:'/goods/add',component:add},
        {path:'/orders',component:order},
        {path:'/reports',component:report}


      ]
    }

  ]
})

// 设置导航守卫
router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next() //如果去到登录页面，直接放行
  if (!sessionStorage.getItem('token')) return next('/login') //如果sessionStorage里面没有token,直接让它去到登录页面
  next() //如果有token，直接放行
})



export default router

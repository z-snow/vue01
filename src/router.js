import Vue from 'vue'
import Router from 'vue-router'
// 注册登录路由组件
import login from './components/login.vue'
import home from './components/home.vue'
import welcome from './components/welcome.vue'
import user from './components/users/user.vue'
import rights from './components/power/rights.vue'
import roles from './components/power/roles.vue'
import cate from './components/goods/cate.vue'

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
        {path:'/categories',component:cate}

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

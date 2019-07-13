import Vue from 'vue'
import Router from 'vue-router'
// 注册登录路由组件
import login from './components/login.vue'
import home from './components/home.vue'


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
      component: home
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

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css';
// 导入字体图标
import './assets/fonts/iconfont.css'
// 设置控制台默认警示框隐藏
Vue.config.productionTip = false
    // 导入全局样式表
import './assets/css/gloable.css'

// 导入注册全局的axios,将axios挂载到全局，每个组件都可以使用this.$http访问axios
import axios from 'axios'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios



new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
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
// 导入vue-table-with-gird   VUE提供的表格插件
import TreeTable from 'vue-table-with-tree-grid'
// 注册组件TreeTable
Vue.component('tree-table', TreeTable)


// 导入富文本编辑器组件
import VueQuillEditor from 'vue-quill-editor'
// 注册富文本编辑器
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

// 导入请求进度条
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'




// 注册时间的过滤器
Vue.filter('format', function (value, arg) {
  function dateFormat(date, format) {
    if (typeof date === "string") {
      var mts = date.match(/(\/Date\((\d+)\)\/)/);
      if (mts && mts.length >= 3) {
        date = parseInt(mts[2]);
      }
    }
    date = new Date(date);
    if (!date || date.toUTCString() == "Invalid Date") {
      return "";
    }
    var map = {
      "M": date.getMonth() + 1, //月份 
      "d": date.getDate(), //日 
      "h": date.getHours(), //小时 
      "m": date.getMinutes(), //分 
      "s": date.getSeconds(), //秒 
      "q": Math.floor((date.getMonth() + 3) / 3), //季度 
      "S": date.getMilliseconds() //毫秒 
    };

    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
      var v = map[t];
      if (v !== undefined) {
        if (all.length > 1) {
          v = '0' + v;
          v = v.substr(v.length - 2);
        }
        return v;
      } else if (t === 'y') {
        return (date.getFullYear() + '').substr(4 - all.length);
      }
      return all;
    });
    return format;
  }
  return dateFormat(value, arg);
})

//   使用moment插件格式化时间，体积较大，需要优化
// import moment from 'moment'
// Vue.filter('format',function(val){
//     return moment(val).format('llll')
// })


// 导入注册全局的axios,将axios挂载到全局，每个组件都可以使用this.$http访问axios
import axios from 'axios'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 有权限的数据的请求拦截，后端要求在请求头里面添加字段Authorization
axios.interceptors.request.use(function (config) {
  Nprogress.start() //在请求拦截器中进度条开始显示
  config.headers.Authorization = sessionStorage.getItem('token')
  // console.log(config);
  return config; //必须使用return 
})

axios.interceptors.response.use(function (config) {
  Nprogress.done() //在响应拦截器中进度条开始显示
  return config; //必须使用return 
})

Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

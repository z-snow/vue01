<template>
  <el-container>
 <!-- 头部区域-->
    <el-header> 
      <div>
        <img src="../assets/heima.png"/>
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
      <el-container>
       <!-- 侧边栏区域-->
          <el-aside :width="isCollapse ? '64px': '200px'">
         <!-- 控制折叠与展开的div-->
           <div class="collapse" @click="collapse">| | |</div>
            <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active='activePath'>  <!--router 开启路由模式，elementUI提供的，将跳转的路径为index设置的值-->
              <!-- 一级导航 -->
              <el-submenu :index="item.id + ''" :key='item.id' v-for="item in menulist">
                <template slot="title">
                  <i :class="iconsObj[item.id]"></i>
                  <span>{{item.authName}}</span>
                </template>  
                 <!-- 二级导航 -->
                <el-menu-item :index="'/' + submenu.path" :key='submenu.id' v-for="submenu in item.children"  @click='getActivePath("/" + submenu.path)'>
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{submenu.authName}}</span>
                  </template>
                </el-menu-item>                 
              </el-submenu>
            </el-menu>
          </el-aside>
           <!-- 主体区域-->
          <el-main>
            <router-view></router-view>  <!--路由站位，这是welcome组件的-->
          </el-main>
      </el-container>
</el-container>
</template>
<script>
export default {
  data(){
    return{
      menulist:[],
      // 定义一个对象保存每个图标的类样式，循环时直接绑定不同的类
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse:false,
      activePath:''
    }
  },
  created() {
    // 在这个钩子里面获取最早的数据
    this.getMenuList()
    // 页面一加载也要获取一次本地里面有没有保存activePath这个键，有就赋值给data中的activePath
    this.activePath = sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出功能，将token移出，使用编程式导航，跳转到登录页面
    logout() {
      // sessionStorage.clear()
      sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    // 页面一加载，就要发送ajax请求，获取数据，定义这个方法，在钩子函数中调用
    async getMenuList(){
      const{data: res }= await this.$http.get('/menus')
      if(res.meta.status !== 200) return this.$message(res.meta.msg)
      // console.log(res.data)
      this.menulist = res.data
      // console.log(this.menulist.data)
    },
    // 控制左侧菜单的展开与关闭
    collapse(){
      this.isCollapse =!this.isCollapse
    },
    // 控制二级菜单的颜色高亮状态，点击二级菜单，将路径保存到sessionstorage,
    getActivePath(activePath){
      this.activePath = activePath  
      sessionStorage.setItem("activePath",activePath)
    }
  }
};
</script>

<style lang="less" scoped>
.el-container{
  height:100%;
}
.el-header {
  display:flex;
  justify-content:space-between;
  background-color: #373d41;
  color: #fff;
  padding-left: 0;
  font-size: 20px;
  align-items: center;
  div {
    display:flex;
    align-items: center;
    span{
      margin-left: 15px;
    }
  }  
}

.el-aside {
   background-color: #333744;
    .collapse {
      text-align: center;
      color:#fff;
      font-size:20px;
      cursor: pointer;
    } 
   .el-menu {
     border-right:none;
   }
}
.el-main {
    background-color: #eaedf1;
}
.iconfont{
  margin-right:10px;
}
</style>

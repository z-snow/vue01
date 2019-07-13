<template>
    <div class='login_container'>
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avator_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 表单区域 -->
            <el-form :model="loginForm" ref="loginForm" :rules="rules" label-width="0px" class="form_box">
                <!-- 用户名 -->
                <el-form-item  prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                 <el-form-item  prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                 <el-form-item class="btns" >
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { async } from 'q';
export default {
    data(){
        return {
            loginForm: {
                username:'admin',
                password:'123456'
            },
            rules: {
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                password:[
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ]
            }
        }
    },
    methods:{
        resetForm(){
            // console.log(this);表单重置的方法，element 提供
            this.$refs.loginForm.resetFields()
        },
        login(){
            // 登录预验证，参数是一个回调函数，返回一个布尔值
            this.$refs.loginForm.validate(async bool=>{
                // console.log(bool); 
                if(!bool) return;  //登录失败
               const {data:res} = await this.$http.post('login',this.loginForm); //使用解构赋值将返回的promise对象中的data赋值给变量res
            //    console.log(res);
                if(res.meta.status !== 200) {
                    this.$message.error('登录失败');
                }else {
                    // this.$message.success('登录成功');  //也可以这样写
                    this.$message({
                        message: '登录成功',
                        type: 'success'
                    });
                    // 把token存储到sessionStorage
                    // console.log(res.data.token);
                    sessionStorage.setItem('token',res.data.token);
                    // 使用编程式导航跳转到home页面
                    this.$router.push('/home')
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>  //less语法需要安装less-loder ，scoped 必须添加防止命名冲突
    .login_container{
        background-color: #2d4d6d;
        height: 100%;
        width: 100%;
    }
    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        .avator_box{
            width: 130px;
            height: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);
            background-color: #fff;
        }
        img {
            width: 10 0%;
            height: 100%;
            background-color: #eee;
            border-radius: 50%;
        }
        .btns {
            float: right;
        }
        .form_box {
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 0 20px;
            box-sizing: border-box;
        }
    }
</style>
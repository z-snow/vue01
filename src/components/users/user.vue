<template>
    <div>
    <!-- 面包屑导航 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card class="box-card">
            <!-- 搜索区域 -->
            <el-row :gutter='20'>
                <el-col :span="10">
                    <!-- 根据输入内容搜索数据，清空用户数据，加上clearable， -->
                    <el-input placeholder="请输入内容" v-model="queryUser.query" clearable @clear="queryUserList">
                    <el-button slot="append" icon="el-icon-search" @click='queryUserList()'></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                        <el-button type="primary" class="addUser" @click='addDialogVisible = true'>添加用户</el-button>
                </el-col>
            </el-row> 
            <!-- 表格区域 -->
            <el-table :data="userlist" stripe style="width: 100%" border class="userTable">
                <el-table-column type="index" label="序号" >
                </el-table-column>
                <el-table-column prop="username" label="姓名" >
                </el-table-column>
                <el-table-column prop="mobile" label="电话" >
                </el-table-column>
                <el-table-column prop="email" label="邮箱" >
                </el-table-column>
                <el-table-column prop="role_name" label="角色" >
                </el-table-column>
                <el-table-column prop="mg_state" label="状态" >
                    <!-- 使用作用域插槽，控制子组件的内容 -->
                   <template v-slot="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
                   </template>
                </el-table-column>
                <el-table-column prop="" label="操作"  width="200">
                    <template v-slot='scope'>
                        <!-- 编辑按钮 -->
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
                            </el-tooltip>
                            <!-- 删除按钮 -->
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                    <el-button type="danger" icon="el-icon-delete" size="mini" class="denBtn" @click="deleteUser(scope.row.id)"></el-button>
                            </el-tooltip>
                            <!-- 分配角色按钮 -->
                            <el-tooltip class="item" effect="dark" content="角色分配" placement="top">
                                <el-button type="warning" icon="el-icon-setting" size="mini" class="warBtn"></el-button>
                            </el-tooltip>
                    </template>
                </el-table-column>
               
          </el-table>

          
        <!-- 分页展示 -->
        <div class="block">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="queryUser.pagenum"
                  :page-sizes="[1, 3, 5, 10]"
                  :page-size="queryUser.pagesize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total">
                </el-pagination>
        </div>
        </el-card>

        <!-- 添加用户对话框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="70%" @close='closeAddDialog'>
            <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                 <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                 <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                 <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUsers">确 定</el-button>
            </span>
            </el-dialog>
    
       
        <!-- 编辑对话框 -->
        <el-dialog title="编辑用户" :visible.sync="editDialogVisible"  @close='closeEditDialog'>
            <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="70px">
                <el-form-item label="姓名" >
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                 <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                 <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUsers">确 定</el-button>
        </span>
        </el-dialog>
    
    
    
    </div>
</template>
<script>
export default {
    data(){
        // 验证邮箱的规则
         var checkEmail = (rule, value, callback) => {
             const regEmail = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
            if (regEmail.test(value)) {
                callback()
            }else {
                return callback(new Error('请输入合法的邮箱'));
            }
         }
        //验证手机号的规则
         var checkMobile = (rule, value, callback) => {
             const  regMobile = /1\d{10}/
            if (regMobile.test(value)) {
                callback()
            }else {
                return callback(new Error('请输入合法的手机号'));
            }
         }
        return{
            userlist:[],
            total:0,
            queryUser:{
                query:'',
                // 当前第几页
                pagenum:1,
                // 一页显示多少条
                pagesize:2
            },
            username:'',
            mobile:'',
            email:'',
            role_name:'',
            // 添加对话框的显示隐藏
            addDialogVisible: false,
            // 添加用户的表单对象
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            // 添加用户的校验规则对象
            addRules:{
                 username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                     password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                     email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                           { validator: checkEmail, trigger: 'blur' }
                    ],
                     mobile: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        { validator: checkMobile, trigger: 'blur' }
                    ]
            },
            // 编辑对话框的显示隐藏
            editDialogVisible:false,
            editForm:{},
            
            editRules:{
                 email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                           { validator: checkEmail, trigger: 'blur' }
                    ],
                     mobile: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        { validator: checkMobile, trigger: 'blur' }
                    ],

            }
        }
    },
    //在这个钩子里面获取用户列表
    created() {
        this.queryUserList()
    },
    methods: {
        //监听获取用户列表
        async queryUserList() {
            const {data:res} = await this.$http.get('/users',{params:this.queryUser})
            this.userlist = res.data.users
            this.total = res.data.total
            // console.log(this.userlist)
        },
        //监听分页的页数改变
        handleSizeChange(val) {
            // console.log(val);
            this.queryUser.pagesize = val
            this.queryUserList()
        },
        //监听当前分页页码改变
        handleCurrentChange(val) {
            // console.log(val);
            this.queryUser.pagenum = val
            this.queryUserList()
        },
        // 监听switch开关状态改变
        async userStateChange(userInfo){
            // console.log(userInfo)
            const {data:res} = await this.$http.put(`/users/${userInfo.id}/state/${userInfo.mg_state}`)
            // console.log(res);
                if(res.meta.status !== 200) {
                this.userInfo.mg_state = !this.userInfo.mg_state
                this.$message.error('用户状态修改失败')
            }else {
                this.$message.success('用户状态修改成功')
            }
        },
        // 监听添加用户对话框的关闭事件 ，重置表单
        closeAddDialog(){
            this.$refs.addFormRef.resetFields()
        },
        // 监听添加用户事件，先进行预验证
        addUsers(){
            this.$refs.addFormRef.validate( async valid =>{
                // console.log(valid);
                if(!valid)  return 
                const {data:res} = await this.$http.post('users',this.addForm)
                // console.log(res);
                if(res.meta.status != 201)  return this.$message.error('用户添加失败')
                this.addDialogVisible = false
                this.queryUserList()
            }) 
        },
        // 监听编辑用户对话框
        showEditDialog(userInfo){
            // console.log(userInfo);
            this.editDialogVisible = true
            this.editForm = userInfo
        },
        // 监听编辑对话框关闭,重置表单
        closeEditDialog(){
            this.$refs.editFormRef.resetFields()

        },
        // 监听编辑用户提交，预验证
        editUsers(){
            this.$refs.editFormRef.validate( async valid =>{
                // console.log(valid);
                if(!valid) return 
                const {data: res} = await this.$http.put('users/'+this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile})
                // console.log(res);
                if(res.meta.status !== 200) return this.$message.error('数据更新失败')
                this.editDialogVisible = false
                this.queryUserList()
            })

           
        },
        // 监听删除用户
        deleteUser(id){
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then( async () => {
                    //用户点击确定按钮，发送请求删除用户
                   const {data: res} = await this.$http.delete('users/'+ id)
                //    console.log(res);
                   if(res.meta.status !== 200) {
                       return this.$message.info(res.meta.msg)
                   }
                    this.$message({ type: 'success',message: '删除成功!'});
                }).catch(() => {
                    //用户点击取消按钮
                    this.$message({ type: 'info',message: '取消删除'
                });          
            });
        }
    }
}
</script>
<style lang="less" scoped>
    
</style>
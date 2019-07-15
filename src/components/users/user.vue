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
                    <el-input placeholder="请输入内容" >
                    <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                        <el-button type="primary" class="addUser">添加用户</el-button>
                </el-col>
            </el-row> 
            <!-- 表格区域 -->
            <el-table :data="userlist" stripe style="width: 100%" border class="userTable">
                <el-table-column type="index" label="#" >
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
                   <template v-slot="scope">
                       {{scope.row.mg_state}}
                        <el-switch v-model="scope.row.mg_state"></el-switch>
                        <!-- <el-switch disabled='scope.row.mg_state'></el-switch> -->

                   </template>
                </el-table-column>
                <el-table-column prop="" label="操作"  width="200">
                    <template v-slot='scope'>
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                    <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                            </el-tooltip>
                            <!-- 删除按钮 -->
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                    <el-button type="danger" icon="el-icon-delete" size="mini" class="denBtn"></el-button>
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
    </div>
</template>
<script>
export default {
    data(){
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
            role_name:''
        }
    },
    created() {
        this.queryUserList()
    },
    methods: {
        async queryUserList() {
            const {data:res} = await this.$http.get('/users',{params:this.queryUser})
            this.userlist = res.data.users
            this.total = res.data.total
            // console.log(this.userlist)
        },
        handleSizeChange(val) {
            // console.log(val);
            this.queryUser.pagesize = val
            this.queryUserList()
        },
        handleCurrentChange(val) {
            // console.log(val);
            this.queryUser.pagenum = val
            this.queryUserList()

        }
    }
}
</script>
<style lang="less" scoped>
    .denBtn,.warBtn {
        margin-left: 0!important;
    }
    .userTable {
        margin-top: 15px!important;
    }
    .addUser {
        margin-right: 10px!important;
    }
    .el-pagination {
        margin-top: 15px;
    }
</style>
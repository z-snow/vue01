<template>
    <div>
           <!-- 面包屑导航 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
         <el-card>
             <el-button type="primary">添加角色</el-button>
              <el-table :data="rolesList" stripe border>
                <el-table-column type="expand">
                     <template v-slot='scope'>
                        <el-row  :key='item1.id' :class="[ i1 === 0 ? 'topBorder': '' ,'botBorder','vcenter']" v-for="(item1,i1) in scope.row.children">                        
                            <!-- 渲染一级权限 -->
                            <el-col :span="6">
                                 <el-tag> {{item1.authName}}</el-tag>                               
                            </el-col>
                            <el-col :span="18"> 
                                <el-row :class="[i2 === 0 ? '':'topBorder', 'botBorder','vcenter']" :key="item2.id" v-for="(item2,i2) in item1.children">
                                    <!-- 渲染二级权限 -->
                                    <el-col :span="6">
                                         <el-tag type="success"> {{item2.authName}}</el-tag> 
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" :key="item3.id" v-for="(item3) in item2.children"> {{item3.authName}}</el-tag> 
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                         <!-- <pre>
                    {{scope.row}}
                         </pre> -->
                     </template>
                </el-table-column>
                <el-table-column type='index' label="序号">
                </el-table-column>
                <el-table-column prop="roleName" label="角色名称"  >
                </el-table-column>
                 <el-table-column prop="roleDesc" label="角色描述" >
                </el-table-column>
                 <el-table-column label="操作"  >
                     <template v-slot='scope'>
                         <el-button type="primary" size='mini' icon="el-icon-edit">编辑</el-button>
                         <el-button type="danger" size='mini' icon="el-icon-delete">删除</el-button>
                         <el-button type="warning" size='mini' icon="el-icon-setting">分配权限</el-button>
                     </template>
                </el-table-column>
                
                </el-table>
         </el-card>
    </div>
</template>
<script>
export default {
     data(){
        return{
            rolesList:[]
        }
    },
    created(){
        this.getRolesList()
    },
    methods:{
       async getRolesList(){
           const {data:res} = await this.$http.get('roles')
        //    console.log(res);
             if(res.meta.status !== 200) return this.$message.error('获取角色列表失败')
             this.rolesList = res.data
            //  console.log(this.rolesList);
        }
    }
}
</script>
<style lang="less" scoped>
.topBorder{
    border-top: 1px solid #eee;
}
.botBorder{
    border-bottom: 1px solid #eee;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>

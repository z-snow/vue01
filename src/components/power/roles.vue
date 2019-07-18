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
                                 <el-tag  closable @close="deleteRightsById(scope.row, item1.id)"> {{item1.authName}}</el-tag> 
                                 <span class="el-icon-caret-right"></span>                              
                            </el-col>
                            <el-col :span="18"> 
                                <el-row :class="[i2 === 0 ? '':'topBorder', 'botBorder','vcenter']" :key="item2.id" v-for="(item2,i2) in item1.children">
                                    <!-- 渲染二级权限 -->
                                    <el-col :span="6">
                                         <el-tag type="success"  closable @close="deleteRightsById(scope.row, item2.id)"> {{item2.authName}}</el-tag> 
                                                                          <span class="el-icon-caret-right"></span>                        
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" :key="item3.id" v-for="(item3) in item2.children" closable @close="deleteRightsById(scope.row, item3.id)"> {{item3.authName}}</el-tag> 
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
                         <el-button type="warning" size='mini' icon="el-icon-setting" @click="showRightSetting(scope.row)">分配权限</el-button>
                     </template>
                </el-table-column>
                
                </el-table>
         </el-card>

           <!-- 展示用户权限对话框区域 -->
        <el-dialog title="用户权限" :visible.sync="userRightdialogVisible" width="50%"  @close="closeRightDialog()">
            <!--树形结构-->
            <el-tree :data="rightList" :props="defaultProps" default-expand-all show-checkbox node-key='id' :default-checked-keys="defKey" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="userRightdialogVisible = false">取 消</el-button>
                <el-button type="primary"  @click="allotRight()">确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>
<script>
export default {
     data(){
        return{
            // 角色列表
            rolesList:[],
            userRightdialogVisible:false,
            // 权限列表
            rightList:[],
            // 树型控件的参数
            defaultProps:{
                 children: 'children',
                 label: 'authName'
            },
            // 默认选中的权限节点
           defKey:[],
           roleId:''
        }
    },
    created(){
        this.getRolesList()
    },
    methods:{
        // 获取所有的角色列表
       async getRolesList(){
           const {data:res} = await this.$http.get('roles')
        //    console.log(res);
             if(res.meta.status !== 200) return this.$message.error('获取角色列表失败')
             this.rolesList = res.data
            //  console.log(this.rolesList);
        },
        // 根据id删除权限
        async deleteRightsById(roles,rightId){
            const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch(err=>err)
                // console.log(confirmResult)
            if(confirmResult != 'confirm' ) {
                return this.$message.info('取消了删除')
            }
            const {data:res} = await this.$http.delete(`roles/${roles.id}/rights/${rightId}`)
            // console.log (res)
            if(res.meta.status !== 200) return this.$message('删除权限失败')
            roles.children = res.data  //不能直接重新获取新的roles数据，页面会重新加载

        },
        //展示用户权限的列表
        async showRightSetting(role){
            this.roleId = role.id
            // 获取所有的用户权限
            const {data:res} = await this.$http.get('rights/tree')
            console.log(res)
            this.rightList = res.data
            //  在生成权限树之前,将所有的三级节点的id获取
            this.getdefKey(role,this.defKey)
            this.userRightdialogVisible = true;
        },
        // 递归遍历所有的权限列表，将所有的三级节点的id添加到defKey数组中
        getdefKey(node,arr){
            if(!node.children) {
                return arr.push(node.id)
            }
            node.children.forEach(item=> this.getdefKey(item,arr))
        },
        //关闭权限对话框之前，需要先清空所有的默认选中节点，否则数关闭会累积，有bug
        closeRightDialog(){
            this.defKey =[]
        },
        // 确定分配权限按钮,传递的参数要求是字符串，使用tree节点的方法，获得的是数组，扩展运算放到一个新数组，在转为字符串
        async allotRight(){
             const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            const keyStr = keys.join(',')
            console.log(keyStr)
            const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:keyStr})
            // console.log(res)
            if(res.meta.status !== 200) return this.$message.error('权限分配失败')
             this.$message.success('权限分配成功')
            this.getRolesList()
            this.userRightdialogVisible = false
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

<template>
    <div>
         <!-- 面包屑导航 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
         <!-- 卡片区域 -->
        <el-card class="box-card">
            <el-button type="primary" @click="showAddCate" >添加分类</el-button>
            <!-- 表格区域，使用插件vue-table-tree-grid -->
                <tree-table class="treeTable" :data="cateList" :columns="columns" border expand-type             :selection-type='false' show-index index-text="#" :show-row-hover="false" :expand-type="false">
                <!-- 是否有效的作用域插槽 -->
                <template slot="isOk" slot-scope="scope">
                    <i class="el-icon-success" style="color:lightgreen" v-if="scope.row.cat_deleted == false" ></i>
                    <i class="el-icon-error" v-else  style="color:red"></i>
                </template>
                <!-- 一二三级分类的作用域查插槽 -->
                <template slot="order" slot-scope="scope">
                    <el-tag type="primary"   v-if="scope.row.cat_level == 0 ">一级分类</el-tag>
                    <el-tag type="success"  v-else-if="scope.row.cat_level == 1">二级分类</el-tag>
                    <el-tag type="warning"   v-else>三级分类</el-tag>
                </template>
                <!-- 编辑删除按钮 -->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary"  size="mini" icon="el-icon-edit" >编辑</el-button>
                    <el-button type="danger"  size="mini" icon="el-icon-delete" >删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%">
            <el-form :model="addCateForm" :rules="addCateRules" ref="addCateFormRef" label-width="100px" @close="closeAddDialog">
                <el-form-item label="分类名称" prop="cat_name">
                  <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <!-- 级联选择器区域 -->
                <el-form-item label="父级分类">
                    <el-cascader class="cascader" v-model="selectedKeys"  :options="parentCateList" :props="cateProps" @change="cascaderChange" clearable>
                    </el-cascader>
                  </el-form-item>
            </el-form>
            
           

            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
        
    </div>
</template>
<script>
export default {
    data(){
        return{
            cateList:[],
            // 所有的分类列表
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            total:0,
            // 表格的配置参数
            columns:[{
                 label: '分类名称',
                 prop: 'cat_name'
            },{
                 label: '是否有效',
                type: 'template',
                template: 'isOk'
            },
            {
                 label: '分类',
                type: 'template',
                template: 'order'
            },
            {
                 label: '操作',
                type: 'template',
                template: 'opt'
            }
            ],
            addCateDialogVisible: false,
            // 添加分类后台数据
            addCateForm:{
                // 父级分类的id
                cat_pid:0,
                // 分类名称
                cat_name:'',
                // 分类层级
                cat_level:0
            },
            // 分类名称的配置规则
            addCateRules:{
                cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
            },
            // 父级分类列表
            parentCateList:[],
            // 级联选择器配置对象
            cateProps:{
                // 默认选中的值
                value:'cat_id',
                // 看得到的值
                label:'cat_name',
                // 使用什么属性级联
                children:'children',
                checkStrictly:true,  //可以只选择单个数据，默认只能选中最后一个
                expandTrigger : 'hover'  
            },
            selectedKeys:[] //双向绑定的数据，得到的是value中的值

        }
    },
    created() {
        this.getCateList(this.selectedKeys)
    },
    methods: {
        // 获取所有的分类列表
        async getCateList(){
            const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
            this.cateList = res.data.result
            this.total = res.data.total
            // console.log(res.data.result)
        },
        // 分页每页条数改变的处理函数
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getCateList()
        },
        // 当前页面改变的处理函数
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getCateList()
        },
        // 添加分类
        showAddCate(){
            this.grtParentCateList()
            this.addCateDialogVisible = true
        },
        // 级联内容变化
        cascaderChange(){
            console.log(this.selectedKeys);
            if(this.selectedKeys.length > 0 ) {  //如果长度大于0,则选择了父级，
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1] //父分类id
               this.addCateForm.cat_level = this.selectedKeys.length  //当前分类的等级
               return
            }else { //长度等于0,则没有选择父级，那父级分类id 重置为0 ，而当前分类的id就是0
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
        },
        // 获取所有的父级分类
        async grtParentCateList(){
            const {data:res} = await this.$http.get('categories',{params:{type:2}})
            if (res.meta.status !== 200) {
                return this.$message.error('获取父级分类数据失败！')
            }
            // console.log(res.data);
            this.parentCateList = res.data
        },
        // 监听添加分类按钮的关闭事件
        closeAddDialog(){
            // 重置表单数据
            this.$refs.addCateFormRef.resetFields()
            this.addCateForm.cat_pid = 0
             this.addCateForm.cat_name =''
             this.addCateForm.cat_level =0
             this.selectedKeys =[]
        },
        // 点击添加分类按钮,先进行预验证
         addCate(){
            this.$refs.addCateFormRef.validate(async valid =>{
                console.log(valid)
                if(!valid) return 
                 const {data:res} = await this.$http.post('categories',this.addCateForm) 
                if(res.meta.status !== 201) {
                    return this.$message.error('添加分类失败')
                }
                            
            })
            
            this.$message.success('添加分类成功')
            this.getCateList()
            this.addCateDialogVisible = false
           
        }
    },

    

}
</script>
<style lang="less" scoped>
    .treeTable {
        margin-top: 20px;
    }
    .cascader {
        width: 100%;
    }
</style>
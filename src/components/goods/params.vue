<template>
    <div>
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
         <!-- 卡片区域 -->
        <el-card class="box-card">
                <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning"  show-icon :closable='false'>
              </el-alert>
              <el-row>
                  <el-col>
                      <span>选择商品分类：</span>
                      <!-- 级联选择器 -->
                      <el-cascader v-model="selectedCateKeys" :options="cateList" :props="cateProps" @change="cateChange"></el-cascader>
                  </el-col>
              </el-row>
              <!-- tab页签区域 -->
              <el-tabs v-model="activeName" @tab-click="handleTabClick">
                  <!-- 动态参数面板 -->
                    <el-tab-pane label="动态参数" name="many"> 
                        <el-button type='primary' size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加动态参数</el-button>
                        <!-- 动态参数的表格 -->
                        <el-table :data="manyTableData" border stripe>
                           
                            <!-- 展开行 -->
                            <el-table-column type="expand">
                                <template v-slot="scope">
                                    <el-tag :key="i"  v-for="(item, i) in scope.row.attr_vals" closable  @close="handleCloseParams(i,scope.row)">{{item}}
                
                                    </el-tag>
                                    <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                    </el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                                </template>
                            </el-table-column>
                             <!-- 索引列 -->
                             <el-table-column type="index">
                                </el-table-column>
                             <el-table-column prop="attr_name" label="参数名称">
                            </el-table-column>
                            <el-table-column label="操作">
                                        <template v-slot="scope">
                                                <el-button type="primary" size="mini" icon="el-icon-edit"  @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                                <el-button type="danger" size="mini" icon="el-icon-delete" @click='deleteParams(scope.row.attr_id)'>删除</el-button>                                       
                                        </template>
                            </el-table-column>
    
                         </el-table>
                    </el-tab-pane>
                     <!-- 静态属性面板 -->
                    <el-tab-pane label="静态属性" name="only">
                            <el-button type='primary' size="mini" :disabled="isBtnDisabled"  @click="addDialogVisible = true">添加静态属性</el-button>
                             <!-- 静态属性的表格 -->
                             <el-table :data="onlyTableData" border stripe>
                                 <!-- 展开行 -->
                                 <el-table-column type="expand">
                                        <template v-slot="scope">
                                            <el-tag :key="i"  v-for="(item, i) in scope.row.attr_vals" closable  @close="handleCloseParams(i,scope.row)">{{item}}
                        
                                            </el-tag>
                                            <el-input
                                            class="input-new-tag"
                                            v-if="scope.row.inputVisible"
                                            v-model="scope.row.inputValue"
                                            ref="saveTagInput"
                                            size="small"
                                            @keyup.enter.native="handleInputConfirm(scope.row)"
                                            @blur="handleInputConfirm(scope.row)"
                                            >
                                            </el-input>
                                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                                        </template>
                                    </el-table-column>
                                    <!-- 索引列 -->
                                    <el-table-column type="index"></el-table-column>
                                     <el-table-column prop="attr_name" label="属性名称">
                                    </el-table-column>
                                    <el-table-column label="操作">
                                                <template v-slot="scope">
                                                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)"> 编辑</el-button>
                                                        <el-button type="danger" size="mini" icon="el-icon-delete" @click='deleteParams(scope.row.attr_id)'>删除</el-button>                                  
                                                </template>
                                    </el-table-column>
            
                                 </el-table>
                    </el-tab-pane>
             </el-tabs>
        </el-card>

        <!-- 添加参数的对话框 -->
        <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addFormClose">
            <!-- 表单 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                    <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                    </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑的对话框 -->
        <el-dialog :title="'编辑' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editFormClose">
            <!-- 表单 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                    <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                    </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
 

    </div>
</template>
<script>
export default {
    data(){
        return{
        
            // 商品分类数据列表
            cateList:[],
            // 级联选择器的配置项
            cateProps:{
                expandTrigger: 'hover', //触发方式
                value:'cat_id',   //绑定的数据，选择后的数据，一般为id
                label:'cat_name',  //级联框中看到的数据         
                children:'children',     // 数据中使用什么属性级联
            },
            selectedCateKeys:[],  //双向绑定的数据，是一个数组，内容是选择的value中的值
            activeName:'many', //tab页签选择的是动态参数还是静态属性，将保存在这里，默认是many，动态参数
            // 动态参数的表格列表
            manyTableData:[],
            // 静态属性的表格列表
            onlyTableData:[],
            // 控制添加参数的对话框显示隐藏
            addDialogVisible:false,
            addForm:{
                attr_name:''
            },
            // 添加分类的对话框效验规则
            addFormRules:{
                attr_name:[{
                    required: true, message: '此项为必填项', trigger: 'blur'
                }]  
            },
            editForm:{
                
            },
            editFormRules:{
                attr_name:[{
                    required: true, message: '此项为必填项', trigger: 'blur'
                }]  
            },
            editDialogVisible:false,
        } 
    },
    created() {
        // 获取所有商品分类列表
        this.getCateList()
    },
    methods: {
        // 获取商品分类列表
        async getCateList(){
            const {data:res} = await this.$http.get('categories')
            if(res.meta.status !== 200) return this.$message.error('获取商品分类失败')
            this.cateList = res.data
            // console.log(res)
        },
        // 级联选择框发生改变的函数，需要获取所选参数
         cateChange(){
            //  如果级联选择器没有选择三级分类，就将表格清空
            if(this.selectedCateKeys.length !== 3) {
                this.manyTableData =[]
                this.onlyTableData =[]
                this.selectedCateKeys = []
            }
            this.getParams()
        },
        // tab页签的改变事件，需要获取所选参数
        handleTabClick(){
            // console.log(this.activeName);
            this.getParams()
        },
        // 获取所选的参数
        async getParams(){
            // console.log(this.selectedCateKeys);
            // 如果级联选择器里面的数组的长度不是3，则不是选择的三级分类，直接return 清空
            if(this.selectedCateKeys.length !== 3) {
                return 
                this.selectedCateKeys = []
            }
            // 选择的是三级分类
            // console.log(this.activeName);
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{
                sel:this.activeName
            }})
            // console.log(res);
            if(res.meta.status !== 200 ) return this.$message.error('获取参数列表失败')
                // console.log(res.data);
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals? item.attr_vals.split(' '):[]
                    item.inputVisible =false //控制添加attr_vals参数的文本框的显示与隐藏
                    item.inputValue =''  //控制添加attr_vals参数的文本框的值
                });       
            // console.log(res.data);
            // 判断激活的tab页签的是静态还是动态，分别将数据赋值给不同的tableData里面
            if(this.activeName == 'many') {
                this.manyTableData = res.data
            }else {
                this.onlyTableData = res.data
            }
            // console.log(this.onlyTableData);
            console.log(this.manyTableData);
           
        },
        // 添加参数的对话框关闭事件
        addFormClose(){
            this.$refs.addFormRef.resetFields()
        },
        // 确定添加参数按钮，先进行预验证
        addParams(){    
            this.$refs.addFormRef.validate(async valid=>{
                // console.log(valid);
                if(!valid) return 
                const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
                    attr_name:this.addForm.attr_name,
                    attr_sel:this.activeName})
                //    console.log(res);
                if(res.meta.status !== 201) return this.$message.error('添加参数失败')
                this.$message.success('添加参数成功')
                this.getParams()
                this.addDialogVisible = false
            })
             
        },
        // 监听编辑对话框关闭
        editFormClose(){
            this.$refs.editFormRef.resetFields()
        },
        // 点击编辑按钮获取对应的数据
        async showEditDialog(attrId){
            // console.log(attrId);
            // 发送请求获取编辑参数数据
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`,{
                attr_sel: this.activeName}) 
                if(res.meta.status !== 200) return this.$message.error('获取参数失败')
                this.editForm = res.data
                // console.log(res);
            this.editDialogVisible = true
        },
        // 点击确定编辑
        async editParams(){
            // console.log(this.editForm.attr_id);
            const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
                attr_name:this.editForm.attr_name,
                attr_sel:this.activeName
            })
            if(res.meta.status !==200) return this.$message.error('更新参数失败')
            this.$message.success('更新参数成功')
            this.getParams()
            this.editDialogVisible = false
            // console.log(res);
        },

        // 删除参数按钮
        async deleteParams(attrId){
           const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'      
            }).catch(error=>error);
            // console.log(confirmResult);
            if(confirmResult !== 'confirm') return this.$message.info('已取消删除')

            const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)
            console.log(res);
            if(res.meta.status !==200) return this.$message.error('删除参数失败')
            this.getParams()
            this.$message.success('删除参数成功')

        },
        // 添加tag参数项
        handleInputConfirm(row){
            // 如果用户没有输入内容，或是只输入了空格，直接return
            if(row.inputValue.trim() == '' ){
                row.inputValue =''
                row.inputVisible = false
                return 
            }
            // 用户输入了合法的内容件内容添加到attr_vals数组中
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue =''
            row.inputVisible = false
           
            // 还需要发送请求，将最新的数据保存到数据库
            this.saveAttrVals(row)
        },
        // 将发送请求，到数据库修改参数的方法抽离，添加删除操作都可用
        async saveAttrVals(row){
            const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                attr_name:row.attr_name,
                attr_sel:row.attr_sel,
                attr_vals:row.attr_vals.join(' ')
            })
            // console.log(res);
            if(res.meta.status !== 200) return this.$message.error('修改参数失败')
            this.$message.success('修改参数成功')    
        
        },
        // 文本框与按钮的切换的事件
        showInput(row){
            console.log(row.inputVisible);
            row.inputVisible = true;
            console.log(row.inputVisible);
            this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
            })
        },
        // 删除tag标签中的参数
        handleCloseParams(i,row){
            console.log(i);
            console.log(row.attr_vals);
            row.attr_vals.splice(i,1)
            // 调用修改参数的方法，将修改保存到数据库
            this.saveAttrVals(row)
        },

    },

    // 添加一个计算属性，监听用户有没有选择三级分类，没有选，需要禁用返回 true 
    computed: {
        isBtnDisabled(){
            if(this.selectedCateKeys.length !== 3) {
                return true
            }
            return false
        },
        // 获取分类的列表需要传递三级分类的id
        cateId(){
            if(this.selectedCateKeys.length === 3){
                return this.selectedCateKeys[2]
            }
            return null
        },
        // 使用一个计算属性，保存用户是选中静态属性还是动态参数
        titleText(){
            if(this.activeName == 'many') {
                return '动态参数'
            }
            return '静态属性'
        }
    },
}
</script>
<style lang="less" scoped>
    .el-row {
        margin-top: 20px;
    }
    .el-button {
        margin-bottom: 15px;
    }
    .el-tag {
        margin: 10px;
    }
    .input-new-tag {
        width: 120px;
    }
</style>
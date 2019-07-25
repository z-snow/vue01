<template>
    <div>
             <!-- 面包屑导航 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
         <el-card>
             <el-alert
                title="添加商品信息"
                type="info"  show-icon :closable="false" center>
            </el-alert>
            <!-- 步骤条 -->
            <!-- 联动效果 需要给激活的做隐式转换，tab栏的name需要一个字符串，步骤条activeIndex需要传入数值类型， -->
            <el-steps :space="200" :active="activeIndex -0" finish-status="success" align-center >
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top" >
            <!-- tab栏 -->
            <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave='changeTab' @tab-click="tabClick">
                
                <!-- 基本信息栏 -->
                <el-tab-pane label="基本信息" name="0"> 
                    <el-form-item label="商品名称" prop="goods_name">
                        <el-input v-model=" addForm.goods_name"></el-input>
                      </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                        <el-input v-model="addForm.goods_price" type='number' min='0'></el-input>
                      </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number"  type='number' min='0'>
                        <el-input v-model=" addForm.goods_number" ></el-input>
                      </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight"  type='number' min='0'>
                        <el-input v-model=" addForm.goods_weight"></el-input>
                    </el-form-item>
                    <!-- 商品分类级联选择器 -->
                    <el-cascader v-model="addForm.goods_cat"
                        :options="cateList"
                        :props="cascateProps"
                        @change="handleChange">
                    </el-cascader>
                </el-tab-pane>

                <!-- 商品参数的tab -->
                <el-tab-pane label="商品参数" name="1">
                    <el-form-item :label="item.attr_name" :key="item.attr_id" v-for='(item) in manyTableData'>
                        <el-checkbox-group v-model="item.attr_vals">
                            <el-checkbox :label="cb" :key="i" v-for='(cb, i) in item.attr_vals' border></el-checkbox>
                          </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>

                <!-- 商品属性 -->
                <el-tab-pane label="商品属性" name="2">
                    <el-form-item :label="item.attr_name" :key='i' v-for="(item, i) in onlyTableData">
                        <el-input v-model="item.attr_vals"></el-input>
                      </el-form-item>
                </el-tab-pane>

                <!-- 上传图片 -->
                <el-tab-pane label="商品图片" name="3">
                    <el-upload
                        :action="uploadURL"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-success ='handleSuccess'
                        multiple
                        list-type="picture" 
                        :headers='header'>
                        <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                </el-tab-pane>


                <el-tab-pane label="商品内容" name="4">
                      <quill-editor v-model="addForm.goods_introduce">
                      </quill-editor>
                      <el-button type="primary" class="addBtn" @click="add">
                          添加商品
                      </el-button>
                </el-tab-pane>
              </el-tabs>
        </el-form>


         </el-card>

         <!-- 图片预览的对话框 -->
         <el-dialog
            title="图片预览"
            :visible.sync="picDialogVisible"
            width="50%"
             >
            <img :src="picUrl" alt="" srcset="" class="img">
            </el-dialog>
    </div>
</template>
<script>
    // 导入loadash，用于深拷贝处理addForm.good_cat
 import _ from 'lodash'
export default {

    data(){
        return{
            activeIndex:'0',
            addForm:{
                goods_name:'' ,
                goods_price:0,
                goods_number:0,
                goods_weight:0,
                goods_cat:'',
                // 上传图片的临时路径
                pics:[],
                goods_introduce:'',
                attrs:[]

            },
            addFormRules:{
                goods_name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },          
          ],
          goods_price:[
          { required: true, message: '请输入商品价格', trigger: 'blur' },          
          ],
          goods_number:[
          { required: true, message: '请输入商品数量', trigger: 'blur' },          
          ],
          goods_weight:[
          { required: true, message: '请输入商品重量', trigger: 'blur' },          
          ]
            },
            // 商品分类列表
            cateList:[],
            // 商品分类级联选择器的配置项
            cascateProps:{
                expandTrigger: 'hover',
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            manyTableData:[],
            onlyTableData:[],

            // 上传图片的地址(需要拼接上完整的后台地址)
            uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
            // 为图片上传添加一个请求头，才能成功上传
            header:{
                Authorization: sessionStorage.getItem('token')
            },
            // 图片预览对话框的显示与隐藏
            picDialogVisible:false,
            // 预览图片的地址，必须是一个绝对地址
            picUrl:''
            
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        // 获取所有分类列表
        async getCateList(){
            const {data:res} = await this.$http.get('categories')
            // console.log(res);
            if(res.meta.status !== 200) return this.$message.console.error('获取商品分类列表失败');
            this.cateList = res.data
            // console.log(this.cateList);
        },
        // 级联选择器发生改变的触发事件
        handleChange(){
            // console.log(this.addForm.goods_cat);
            // 只能选中三级分类
            if(this.addForm.goods_cat.length != 3) {
                this.addForm.goods_cat =[]
            }
            
        },
        // 如果未选中三级分类，就阻止tab栏切换
        changeTab(activeName, oldActiveName){
            // 当处于基本信息栏，tab页签为‘0’的时候，就必须选择三级分类，才让跳转
            if(this.addForm.goods_cat.length !== 3 && oldActiveName === '0') {
               this.$message.error('请先选择分类')
                return false
            }
        },
        // tab栏发生切换触发的事件
        async tabClick(){
            if(this.activeIndex == '1') {
                // console.log(1);
                const {data:res} =await this.$http.get(`categories/${this.cateId}/attributes`,{
                    params:{
                        sel:'many'
                    }
                })
                // console.log(res);
                if(res.meta.status !==200) return this.$message.error('获取动态参数列表失败')   
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals === '' ? [] : item.attr_vals.split(' ')          
                });
                
                this.manyTableData = res.data
                // console.log(this.manyTableData );
            }else if(this.activeIndex == '2') {
                const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
                    params:{
                    sel:'only'
                    }
                })
                if(res.meta.status !==200) return this.$message.error('获取静态属性列表失败')   
                console.log(res);
                this.onlyTableData = res.data
            }          
            

        },
        
        // 图片上传之前的回调
        handlePreview(file){
            console.log(file);
            this.picDialogVisible = true
            this.picUrl = file.response.data.url
        },
        // 图片移出之后的回调
        handleRemove(file, fileList){
            // console.log(file);
            const filePath = file.response.data.tmp_path
            const i = this.addForm.pics.findIndex(function(item){
                item.pic == filePath
            })
            this.addForm.pics.splice(i,1)
            console.log(this.addForm);

        },
        // 图片上传成功的回调
        handleSuccess(response, file, fileLis){
            if(response.meta.status !== 200) return this.$message.error('图片上传失败')
            // console.log(response);
            const picPath = {pic: response.data.tmp_path}
            this.addForm.pics.push(picPath)
             
        },
        add(){
            this.$refs.addFormRef.validate(async valid =>{
                if(!valid) return this.$message.error('请输入完整的信息')
                // console.log(111);

                // 处理attrs商品参数,动态参数
                this.manyTableData.forEach(item=>{
                    // console.log(item);
                    const attrsInfo = {attr_id: item.attr_id,attr_value:item.attr_vals.join(',')}
                    this.addForm.attrs.push(attrsInfo)
                })
                // 静态属性
                this.onlyTableData.forEach(item=>{
                    // console.log(item);
                    const attrsInfo = {attr_id: item.attr_id,attr_value:item.attr_vals}
                    this.addForm.attrs.push(attrsInfo)
                })
                // console.log(this.addForm.attrs);

                // 处理商品分类，需要传的数据是，分隔字串，级联选择器需要的数据是数组，所以需要先深拷贝一份，再做处理
                var form = _.cloneDeep(this.addForm)
                form.goods_cat = form.goods_cat.join(',')
                console.log(form);
                // 数据处理完成，开始发送请求
                const {data:res} = await this.$http.post('goods',form)
                console.log(res);
                if(res.meta.status !==201 ) return this.$message.error('商品添加失败')
                this.$message.success('商品添加成功')
                this.$router.push('/goods')
            })
        }

    },
    computed: {
        cateId(){
            if(this.addForm.goods_cat.length === 3){
                return this.addForm.goods_cat[2]
            }
        }
    },
}
</script>
<style lang="less" scoped>
   .el-checkbox {
       margin: 0 10px 0 0 !important;
   }
   .img {
       width: 100%;
   }
   .quill-editor {
        height: 300px;
   }
   .addBtn {
       margin-top: 80px;
   }
</style>
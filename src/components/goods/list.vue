<template>
    <div>
           <!-- 面包屑导航 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
         <el-card>
               <!-- 搜索区域 -->
            <el-row :gutter='20'>
                    <el-col :span="10">
                        <!-- 根据输入内容搜索数据，清空用户数据，加上clearable， -->
                        <el-input placeholder="请输入内容" v-model='queryGoodsList.query' clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click='getGoodsList'></el-button>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                            <el-button type="primary"  @click='goAddGoods'>添加商品</el-button>
                    </el-col>
                </el-row> 

            <!-- 表格区域 -->
            <el-table :data="goodsList" style="width: 100%" border stripe>
                <!-- 索引列 -->
                    <el-table-column type="index" label="序号" >
                    </el-table-column>
                    <el-table-column prop="goods_name" label="商品名称"  >
                    </el-table-column>
                    <el-table-column prop="goods_price" label="商品价格（元）" width="90px" >
                    </el-table-column>
                    <el-table-column prop="goods_weight" label="商品重量" width="90px">
                    </el-table-column>
                    <el-table-column prop="add_time" label="创建时间" width="160px">
                        <template v-slot="scope" >
                                {{scope.row.add_time | format('yyyy-MM-dd hh:mm:ss') }}             
                        </template>
                    </el-table-column>
                    <el-table-column prop="date" label="操作" width="200px">
                        <template v-slot="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                                <el-button type="danger"  size="mini" icon="el-icon-delete" @click='deleteGoods(scope.row)'>删除</el-button>           
                        </template>
                    </el-table-column>
          </el-table>
          <!-- 分页区域 -->
          <el-pagination @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
          :current-page="queryGoodsList.pagenum"
          :page-sizes="[10, 20, 30, 50]"
          :page-size=" queryGoodsList.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>

         </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return{
            goodsList:[],  
            queryGoodsList:{
                query:'',
                pagenum:1,
                pagesize:10
            },  
            total:0,
            addDialogVisible: false,               
        }
    },
    created(){
        this.getGoodsList()
    },
    methods:{
        // 查询所有的商品列表
        async getGoodsList(){
            const {data:res} = await this.$http.get('goods',{params: this.queryGoodsList})
            // console.log(res);
            if(res.meta.status !==200 ) return this.$message.error('获取商品列表失败')
            this.goodsList = res.data.goods
            this.total = res.data.total
            // console.log(this.goodsList);
        },
        // 分页页码改变
        handleSizeChange(newPage){
            this.queryGoodsList.pagesize  = newPage
            this.getGoodsList()
        },
        // 当前页码改变 
        handleCurrentChange(newSize){
           this.queryGoodsList.pagenum= newSize
            this.getGoodsList()
        },
        // 根据id删除商品
        async deleteGoods(row){
            // console.log(row);
            const confireResult =  await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err=> err)
            // console.log(confireResult)
            if(confireResult != 'confirm') return this.$message.info('已取消删除')
            const {data:res} = await this.$http.delete('goods/' + row.goods_id)
            if(res.meta.status !==200 ) return this.$message.error('删除商品失败')
            this.$message.success('删除商品成功')
            this.getGoodsList()
        },
        goAddGoods(){
            this.$router.push('/goods/add')
        }
       



    }
}
</script>
<style lang="less" scoped>
    
</style>
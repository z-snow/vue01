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
      <el-row>
        <el-col :span="10">
          <!-- 根据输入内容搜索数据，清空用户数据，加上clearable， -->
          <el-input placeholder="请输入内容" v-model="queryOrder.query" clearable @clear="queryOrderList">
            <el-button slot="append" icon="el-icon-search" @click="queryOrderList()"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="orderList" style="width: 100%" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号"> </el-table-column>
        <el-table-column prop="order_price" label="价格"> </el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template v-slot="scope">
            <el-button type="success" round>{{ scope.row.order_pay == "1" ? "已付款" : "未付款" }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货">
          <template v-slot="scope">
            <el-button type="danger" v-if="scope.row.is_send === '否'">否</el-button>
            <el-button type="success" v-else></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="订单时间">
          <template v-slot="scope">
            {{ scope.row.create_time | format("yyyy-MM-dd hh:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showAddress"></el-button>
            <el-button type="success" size="mini" icon="el-icon-location" @click="showProgress"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryOrder.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryOrder.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 展示详细地址对话框 -->
    <el-dialog title="详细地址" :visible.sync="addressDialogVisible" width="50%" @close="closeAddressForm">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader v-model="addressForm.address1" :options="cityData" :props="cascateProps"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示物流进度对话框 -->
    <el-dialog title="物流信息" :visible.sync="progressDialogVisible">
      <!-- 时间线组件 -->
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityData from "./citydata.js";
export default {
  data() {
    return {
      // 获取所有订单列表
      queryOrder: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      // 详细地址展示与隐藏
      addressDialogVisible: false,
      addressForm: {
        address1: [],
        address2: ""
      },
      addressFormRules: {
        address1: [{ required: true, message: "请选择省市区", trigger: "blur" }],
        address2: [{ required: true, message: "请输入详细地址", trigger: "blur" }]
      },
      cityData: cityData,
      cascateProps: {
        expandTrigger: "hover"
      },
      progressInfo: [],
      progressDialogVisible: false
    };
  },
  created() {
    this.queryOrderList();
  },
  methods: {
    async queryOrderList() {
      const { data: res } = await this.$http.get("orders", { params: this.queryOrder });
      console.log(res);
      this.total = res.data.total;
      this.orderList = res.data.goods;
    },
    // 展示地址的按钮
    showAddress() {
      this.addressDialogVisible = true;
    },
    handleSizeChange(newSize) {
      this.queryOrder.pagesize = newSize;
      this.queryOrderList();
    },
    handleCurrentChange(newPage) {
      this.queryOrder.pagenum = newPage;
      this.queryOrderList();
    },
    // 地址表单关闭事件
    closeAddressForm() {
      this.$refs.addressFormRef.resetFields();
    },
    // 物流进度条
    async showProgress() {
      const { data: res } = await this.$http.get("/kuaidi/1106975712662");
      this.progressInfo = res.data;
      console.log(this.progressInfo);
      this.progressDialogVisible = true;
    }
  }
};
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
@import "../../plugins/timeline/timeline.css";
@import "../../plugins/timeline-item/timeline-item.css";
</style>

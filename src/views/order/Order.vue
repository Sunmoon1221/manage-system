<template>
  <div class="order">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="always">
      <Search
        inputPlaceholder="请输入内容"
        v-model="queryInfo.query"
        @search="clickSearchButton"
      ></Search>
      <el-table :data="orderList" style="width: 100%">
        <el-table-column type="index" sortable width="40"> </el-table-column>
        <el-table-column label="订单编号" prop="order_number">
        </el-table-column>
        <el-table-column label="订单价格" width="100" prop="order_price">
        </el-table-column>
        <el-table-column label="是否付款" width="100">
          <template v-slot="scope">
            <el-tag effect="plain" v-if="scope.row.order_pay"> 未付款 </el-tag>
            <el-tag effect="dark" v-else> 已付款 </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" width="100" prop="is_send">
        </el-table-column>
        <el-table-column
          label="下单时间"
          :formatter="formatter"
          prop="create_time"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改"
              placement="top"
              :enterable="false"
            >
              <el-button
                icon="el-icon-edit"
                circle
                @click="clickEditBtn(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="物流进度"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="success"
                icon="el-icon-location-outline"
                circle
                @click="clickLogBtn"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      >
      </el-pagination>
      <el-dialog
        title="物流进度"
        :visible.sync="logDialogVisible"
        width="50%"
        @close="closeLog"
      >
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(log, index) in logiList"
            :key="index"
            :timestamp="log.time"
          >
            {{ log.context }}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getOrders, getLogi } from "@/network/order";
import Search from "@/components/common/search/Search";
import moment from "moment";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      orderList: [],
      totalNum: 0,
      logDialogVisible: false,
      logiList: [
        {
          time: "2018-05-10 09:39:00",
          ftime: "2018-05-10 09:39:00",
          context: "已签收,感谢使用顺丰,期待再次为您服务",
          location: "",
        },
        {
          time: "2018-05-10 08:23:00",
          ftime: "2018-05-10 08:23:00",
          context:
            "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          location: "",
        },
        {
          time: "2018-05-10 07:32:00",
          ftime: "2018-05-10 07:32:00",
          context: "快件到达 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-10 02:03:00",
          ftime: "2018-05-10 02:03:00",
          context:
            "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-09 23:05:00",
          ftime: "2018-05-09 23:05:00",
          context: "快件到达 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 21:21:00",
          ftime: "2018-05-09 21:21:00",
          context: "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 13:07:00",
          ftime: "2018-05-09 13:07:00",
          context: "顺丰速运 已收取快件",
          location: "",
        },
        {
          time: "2018-05-09 12:25:03",
          ftime: "2018-05-09 12:25:03",
          context: "卖家发货",
          location: "",
        },
        {
          time: "2018-05-09 12:22:24",
          ftime: "2018-05-09 12:22:24",
          context: "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          location: "",
        },
        {
          time: "2018-05-08 21:36:04",
          ftime: "2018-05-08 21:36:04",
          context: "商品已经下单",
          location: "",
        },
			],
			reverse: true
			
    };
  },
  components: {
    Search,
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const params = this.queryInfo;
      const { data: res } = await getOrders(params);
      if (res.meta.status !== 200) return this.$message.error("获取列表失败");
      this.totalNum = res.data.total;
      this.orderList = res.data.goods;
      console.log(this.orderList);
    },
    async getLog() {
      const { data: res } = await getLogi();
      console.log(res);
    },
    // 格式化时间
    formatter(row, column) {
      let date = new Date(row.create_time * 1000);
      return moment(date).format("YYYY-MM-DD hh:mm:ss");
    },
    clickEditBtn(order) {},
    clickLogBtn() {
      this.logDialogVisible = true;
      // 请求数据
      // this.getLog()
    },
    closeLog() {},
    // 分页
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getOrderList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getOrderList();
    },
    // 搜索
    clickSearchButton() {
      this.getOrderList();
    },
  },
};
</script>

<style>
.el-table {
  margin: 20px 0 30px 0;
}
</style>
<template>
  <div class="goods-list">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="always">
      <el-row :gutter="24">
        <el-col :span="10" :offset="0">
          <Search
            inputPlaceholder="请输入内容"
            v-model="goodsInfo.query"
            @search="clickSearchButton"
          ></Search
        ></el-col>
        <el-col :span="2" :offset="10">
          <el-button
            type="primary"
            size="medium"
            round
            class="addUserBtn"
            @click="clickAddUserBtn"
            >添加商品</el-button
          >
        </el-col>
      </el-row>

      <el-table
        :data="goodsList"
        style="width: 100%"
        :default-sort="{ prop: 'upd_time', order: 'descending' }"
      >
        <el-table-column type="index" sortable width="40"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格"
          sortable
          width="120"
        >
        </el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="100">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100">
        </el-table-column>
        <el-table-column
          prop="upd_time"
          label="创建时间"
          sortable
          :formatter="formatter"
          width="180"
        >
        </el-table-column>
        <el-table-column label="设置" width="180">
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
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="info"
                icon="el-icon-delete"
                circle
                @click="clickDeleteBtn(scope.row.goods_id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsInfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="goodsInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import Search from "../../components/common/search/Search";
import { getGoods, deleteGoods } from "../../network/goods";
import moment from "moment";
export default {
  components: {
    Search,
  },
  data() {
    return {
      goodsInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      goodsList: [],
      total: 0,
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 请求商品列表
    async getGoodsList() {
      const { data: res } = await getGoods(this.goodsInfo);
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表失败");
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      console.log(res);
    },
    async deleteGood(id) {
      let url = `goods/${id}`;
			const { data: res } = await deleteGoods(url);
			if(res.meta.status !== 200) return this.$message.error('删除失败')
			this.getGoodsList()
      console.log(res);
    },
    // 格式化时间
    formatter(row, column) {
      let date = new Date(row.upd_time * 1000);
      return moment(date).format("YYYY-MM-DD hh:mm:ss");
    },
    // 分页
    handleSizeChange(val) {
      this.goodsInfo.pagesize = val;
      this.getGoodsList();
    },
    handleCurrentChange(val) {
      this.goodsInfo.pagenum = val;
      this.getGoodsList();
    },
    // 搜索
    clickSearchButton() {
      this.getGoodsList();
    },
    // 添加商品
    clickAddUserBtn() {
			// 跳转到添加商品页面
			this.$router.push('goods/add')
		},
    // 修改
    clickEditBtn(good) {
      console.log(good);
    },
    // 删除
    clickDeleteBtn(id) {
      this.$confirm("是否删除该商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteGood(id)
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
</style>
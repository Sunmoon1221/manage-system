<template>
  <div class="right-list">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="rightList" stripe style="width: 100%">
        <el-table-column type="index" width="80"> </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180">
        </el-table-column>
        <el-table-column prop="path" label="路径" width="180">
        </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="scope">
            <el-tag effect="plain" v-if="scope.row.level === '0'"
              >等级一</el-tag
            >
            <el-tag type="info" v-else-if="scope.row.level === '1'"
              >等级二</el-tag
            >
            <el-tag type="" v-else>等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getAllRightList } from "../../network/power";
export default {
  data() {
    return {
      rightList: [],
    };
  },
  created() {
    this.getRightList();
  },
  methods: {
    async getRightList() {
      const { data: res } = await getAllRightList("rights/list");
      if (res.meta.status !== 200)
        return this.$message.error("获取权限列表失败");
      this.rightList = res.data;
      console.log(this.rightList);
    },
  },
};
</script>

<style>
.el-tag {
  margin-right: 10px;
}
</style>
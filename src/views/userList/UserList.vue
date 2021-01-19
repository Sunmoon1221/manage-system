<template>
  <div class="userList">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="always">
      <Search inputPlaceholder="请输入姓名" 
			v-model="user.query"
			@search="clickSearchButton"></Search>
      <el-table
        stripe
        :data="newUserList"
        style="width: 100%"
        :default-sort="{ prop: 'create_time', order: 'descending' }"
      >
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="create_time" label="日期" sortable width="120">
        </el-table-column>
        <el-table-column prop="username" label="姓名" sortable width="120">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="140">
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" width="140">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="120">
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStatusChange(scope.row)"
            />
          </template>
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
              <el-button icon="el-icon-edit" circle></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button type="info" icon="el-icon-delete" circle></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit-outline"
                circle
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="user.pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="user.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import Search from "@/components/common/search/Search";

import { getUsers,putEditUser } from "../../network/user";
import moment from "moment";
export default {
  components: {
    Search,
  },
  data() {
    return {
      user: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      userList: [],
      totalNum: 0,
      currentPage: 1,
    };
  },
  created() {
    this.getUserList();
  },
  computed: {
    newUserList() {
      let newarr = this.userList.map((item) => {
        let date = new Date(item.create_time * 1000);
        return {
          ...item,
          create_time: moment(date).format("YYYY-MM-DD"),
        };
      });
      return newarr;
    },
  },
  methods: {
    async getUserList() {
      const { data: res } = await getUsers(this.user);
      if (res.meta.status !== 200)
        return this.$message.error("获取管理员列表失败");
      this.userList = res.data.users;
      this.totalNum = res.data.total;

      console.log(this.userList);
		},
		async editUser(userInfo) {
			let url = `users/${userInfo.id}/state/${userInfo.mg_state}`
			// let url = `users/${userInfo.id}/stte/${userInfo.mg_state}`
			const { data: res } = await putEditUser(url);
			if(res.meta.status!== 200) {
				userInfo.mg_state = !userInfo.mg_state
				return this.$message.error("更新用户状态失败");
			}
			
			console.log(res)
		},
    handleSizeChange(val) {
			this.user.pagesize = val
			this.getUserList();
    },
    handleCurrentChange(val) {
			this.user.pagenum = val
			this.getUserList();
		},
		userStatusChange(userInfo) {
			// this.editUser(userInfo.id,userInfo.mg_state)
			this.editUser(userInfo)
		},
		clickSearchButton() {
			this.getUserList()
		}
  },
};
</script>

<style lang="less" scoped>
.el-card {
  height: 500px;
}
.el-table {
	margin: 18px 0;
}
</style>
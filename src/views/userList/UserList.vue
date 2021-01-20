<template>
  <div class="userList">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="always">
      <el-row :gutter="24">
        <el-col :span="8" :offset="0">
          <Search
            inputPlaceholder="请输入姓名"
            v-model="user.query"
            @search="clickSearchButton"
          ></Search
        ></el-col>
        <el-col :span="2" :offset="12">
          <el-button
            type="primary"
            size="medium"
            round
            class="addUserBtn"
            @click="clickAddUserBtn"
            >添加管理员</el-button
          >
        </el-col>
      </el-row>

      <el-table
        stripe
        :data="newUserList"
        style="width: 100%"
        :default-sort="{ prop: 'create_time', order: 'descending' }"
      >
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="create_time" label="日期" sortable width="120">
        </el-table-column>
        <el-table-column prop="username" label="姓名" sortable width="100">
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
              <el-button
                icon="el-icon-edit"
                @click="clickEditUserBtn(scope.row.id)"
                circle
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button type="info" icon="el-icon-delete" circle @click="clickDeleteUserBtn(scope.row.id)"></el-button>
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
      <!-- 添加管理员对话框 -->
      <el-dialog
        title="添加管理员"
        :visible.sync="addUserDialogVisible"
        width="44%"
        center
        @close="closeAddUserForm"
      >
        <el-form
          :model="addUserForm"
          :rules="addUserFormRules"
          ref="addUserFormRef"
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-form-item label="姓名" prop="username">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            round
            class="cancelBtn"
            @click="addUserDialogVisible = false"
            >取 消</el-button
          >
          <el-button round class="sureBtn" type="primary" @click="clickAddUser"
            >添 加</el-button
          >
        </span>
      </el-dialog>
      <!-- 修改管理员信息对话框 -->
      <el-dialog
        title="修改信息"
        :visible.sync="editUserDialogVisible"
        width="50%"
      >
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="80px"
          class="demo-ruleForm"
          @close="closeEditForm"
        >
          <el-form-item label="姓名" prop="username">
            <el-input disabled v-model="editForm.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input> </el-form-item
        ></el-form>
        <span slot="footer" class="dialog-footer">
          <el-button round @click="editUserDialogVisible = false"
            >取 消</el-button
          >
          <el-button round type="primary" @click="clickEditUser"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Search from "@/components/common/search/Search";

import {
  getUsers,
  postAddUsers,
  putEditUserState,
  getUserById,
	putEditUser,
	deleteUserById
} from "../../network/user";
import moment from "moment";
export default {
  components: {
    Search,
  },
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    return {
      user: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      userList: [],
      totalNum: 0,

      addUserDialogVisible: false,

      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addUserFormRules: {
        username: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },

      editUserDialogVisible: false,
      editForm: {
        email: "",
        mobile: "",
      },
      editFormRules: {
        email: [{ validator: checkEmail, trigger: "blur" }],
        mobile: [{ validator: checkMobile, trigger: "blur" }],
      },
    };
  },
  created() {
    this.getUserList();
  },
  computed: {
    // 格式化时间戳
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
    // 请求用户列表
    async getUserList() {
      const { data: res } = await getUsers(this.user);
      if (res.meta.status !== 200)
        return this.$message.error("获取管理员列表失败");
      this.userList = res.data.users;
      this.totalNum = res.data.total;
    },
    async editUserState(userInfo) {
      let url = `users/${userInfo.id}/state/${userInfo.mg_state}`;
      // let url = `users/${userInfo.id}/stte/${userInfo.mg_state}`
      const { data: res } = await putEditUserState(url);
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      console.log(res);
    },
    async addUser() {
      const { data: res } = await postAddUsers(this.addUserForm);
      if (res.meta.status !== 201) return this.$message.error("创建用户失败");
      this.addUserDialogVisible = false;
      this.getUserList();
    },
    async getEditUser(id) {
      const { data: res } = await getUserById(`users/${id}`);
      if (res.meta.status !== 200)
        return this.$message.error("获取用户信息失败");
      this.editForm = res.data;
      // TODO待删除
      console.log(this.editForm);
    },
    async editUser() {
      let url = `users/${this.editForm.id}`;
      let { email, mobile } = this.editForm;
      let dataForm = { email, mobile };
      const { data: res } = await putEditUser(url, dataForm);
      if (res.meta.status !== 200) return this.$message.error("修改信息失败");
      this.editUserDialogVisible = false;
      this.getUserList();
		},
		async deleteUser(id) {
			let url = `users/${id}`
			const {data: res} = await deleteUserById(url)
			if(res.meta.status !== 200) return this.$message.error('删除失败')
			this.getUserList()
			console.log(res)
		},
    handleSizeChange(val) {
      this.user.pagesize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.user.pagenum = val;
      this.getUserList();
    },
    userStatusChange(userInfo) {
      // this.editUser(userInfo.id,userInfo.mg_state)
      this.editUserState(userInfo);
    },
    clickSearchButton() {
      this.getUserList();
    },
    clickAddUserBtn() {
      this.addUserDialogVisible = true;
    },
    closeAddUserForm() {
      this.$refs.addUserFormRef.resetFields();
    },
    clickAddUser() {
      this.$refs.addUserFormRef.validate((valid) => {
        if (!valid) return;
        this.addUser();
      });
    },
    clickEditUserBtn(id) {
      this.getEditUser(id);
      this.editUserDialogVisible = true;
    },
    closeEditForm() {
      this.$refs.editForm.resetFields();
    },
    clickEditUser() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return;
        this.editUser();
      });
    },
    clickDeleteUserBtn(id) {
      this.$confirm("是否删除该管理员?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
					this.deleteUser(id)
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

<style lang="less" scoped>
.el-card {
  // height: 500px;
  padding-top: 8px;
}
.el-table {
  margin: 18px 0;
  overflow-x: hidden;
}
.addUserBtn {
}
/deep/.el-input__inner {
  width: 80%;
}
.cancelBtn {
  margin-right: 40px;
}
/deep/.el-dialog {
  border-radius: 20px;
}
</style>
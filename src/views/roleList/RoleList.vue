<template>
  <div class="role-list">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-col :span="6" :offset="22"
          ><el-button
            type="primary"
            size="medium"
            round
            class="addUserBtn"
            @click="clickAddRoleBtn"
            >添加角色</el-button
          ></el-col
        >
      </el-row>
      <el-row class="row-bg">
        <el-col :span="24" :offset="0"
          ><el-table :data="roleList" stripe style="width: 100%">
            <!-- 打开expand -->
            <el-table-column type="expand" width="80">
              <template v-slot="scope">
                <el-row
                  type="flex"
                  align="middle"
                  v-for="(item1, idx1) in scope.row.children"
                  :key="item1.id"
                  :class="['bbottom', idx1 === 0 ? 'btop' : '']"
                >
                  <!-- {{item1}} -->
                  <el-col :span="5">
                    <el-tag
                      type=""
                      effect="dark"
                      closable
                      @close="clickRemoveRight(scope.row, item1.id)"
                    >
                      {{ item1.authName }}
                    </el-tag>
                  </el-col>
                  <el-col :span="19">
                    <el-row
                      type="flex"
                      align="middle"
                      v-for="(item2, idx2) in item1.children"
                      :key="item2.id"
                      :class="[idx2 === 0 ? '' : 'btop']"
                    >
                      <el-col :span="6">
                        <el-tag
                          type="info"
                          effect="plain"
                          closable
                          @close="clickRemoveRight(scope.row, item2.id)"
                          >{{ item2.authName }}</el-tag
                        >
                      </el-col>
                      <el-col :span="18">
                        <el-tag
                          v-for="item3 in item2.children"
                          :key="item3.id"
                          type=""
                          effect="plain"
                          closable
                          @close="clickRemoveRight(scope.row, item3.id)"
                          >{{ item3.authName }}</el-tag
                        >
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column type="index" width="80"> </el-table-column>
            <el-table-column prop="roleName" label="角色名" width="180">
            </el-table-column>
            <el-table-column prop="roleDesc" label="职责" width="220">
            </el-table-column>
            <el-table-column label="设置" width="360">
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
                    @click="clickDeleteRoleBtn(scope.row.id)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="分配权限"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="primary"
                    icon="el-icon-edit-outline"
                    circle
                    @click="clickAllotBtn(scope.row)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column> </el-table
        ></el-col>
      </el-row>
      <!-- 添加角色对话框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addRoleDialogVisible"
        width="50%"
        center
        @close="closeRoleForm"
      >
        <el-form
          :model="addRoleForm"
          :rules="addRoleFormRules"
          ref="addRoleFormRef"
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="职责" prop="roleDesc">
            <el-input v-model="addRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            round
            class="cancelBtn"
            @click="addRoleDialogVisible = false"
            >取 消</el-button
          >
          <el-button round class="sureBtn" type="primary" @click="clickAddRole"
            >添 加</el-button
          >
        </span>
      </el-dialog>
      <!-- 修改角色对话框 -->
      <el-dialog
        title="修改信息"
        :visible.sync="editRoleDialogVisible"
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
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="职责" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button round @click="editRoleDialogVisible = false"
            >取 消</el-button
          >
          <el-button round type="primary" @click="clickEditRole"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 分配权限对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="allotRightDialogVisible"
        width="50%"
        @close="closeAllotDialog"
      >
        <el-tree
          default-expand-all
          :data="rightList"
          :props="defaultProps"
          show-checkbox
          node-key="id"
          :default-checked-keys="checkedKeys"
					ref="allotRef"
        >
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button round @click="allotRightDialogVisible = false"
            >取 消</el-button
          >
          <el-button round type="primary" @click="clickAllotRight"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getRoles,
  deleteRight,
  postRole,
  getRoleById,
  putEditRole,
  deleteRole,
  postAllotRight,
} from "@/network/role";
import { getAllRightList } from "@/network/power";
export default {
  data() {
    return {
      roleList: [],
      addRoleDialogVisible: false,
      addRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      addRoleFormRules: {
        roleName: [
          { required: true, message: "角色名不能为空", trigger: "blur" },
        ],
      },
      editRoleDialogVisible: false,
      editForm: {
        roleName: "",
        roleDesc: "",
      },
      editFormRules: {
        roleName: [
          { required: true, message: "角色名不能为空", trigger: "blur" },
        ],
      },

      allotRightDialogVisible: false,
      rightList: [],
      defaultProps: {
        children: "children",
        label: "authName",
      },
			checkedKeys: [],
			roleId: ''
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await getRoles();
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.roleList = res.data;
      console.log(this.roleList);
    },
    async removeRight(role, rightId) {
      let url = `roles/${role.id}/rights/${rightId}`;
      const { data: res } = await deleteRight(url);
      role.children = res.data;
    },
    async addRole() {
      const { data: res } = await postRole(this.addRoleForm);
      if (res.meta.status !== 201) return this.$message.error("创建角色失败");
      this.getRolesList();
      this.addRoleDialogVisible = false;
    },
    async getRole(id) {
      let url = `roles/${id}`;
      const { data: res } = await getRoleById(url);
      if (res.meta.status !== 200)
        return this.$message.error("获取角色信息失败");
      this.editForm = res.data;
    },
    async editRole() {
      let url = `roles/${this.editForm.roleId}`;
      let { roleName, roleDesc } = this.editForm;
      let dataForm = { roleName, roleDesc };
      const { data: res } = await putEditRole(url, dataForm);
      this.getRolesList();
    },
    async removeRole(id) {
      let url = `roles/${id}`;
      const { data: res } = await deleteRole(url);
      if (res.meta.status !== 200) return this.$message.error("删除角色失败");
      this.getRolesList();
    },
    async getRightList(role) {
      let url = `rights/tree`;
      const { data: res } = await getAllRightList(url);
      if (res.meta.status !== 200)
        return this.$message.error("获取权限列表失败");
      this.rightList = res.data;
      this.getLeafKeys(role, this.checkedKeys);
      console.log(this.rightList);
    },
    async allotRight() {
			let url = `roles/${this.roleId}/rights`
			let keys = [...this.$refs.allotRef.getCheckedKeys(),...this.$refs.allotRef.getHalfCheckedKeys()].join(',')
			console.log(keys)
			const {data: res} = await postAllotRight(url,{rids: keys})
			if(res.meta.status !== 200) return this.$message.error('分配权限失败')
			this.getRolesList()
			this.allotRightDialogVisible = false
    },
    clickRemoveRight(role, rightId) {
      this.$confirm("是否删除该权限?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.removeRight(role, rightId);
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
    clickAddRoleBtn() {
      this.addRoleDialogVisible = true;
    },
    closeRoleForm() {
      this.$refs.addRoleFormRef.resetFields();
    },
    clickAddRole() {
      this.$refs.addRoleFormRef.validate((valid) => {
        if (!valid) return;
        this.addRole();
      });
    },
    closeEditForm() {},
    clickEditBtn(role) {
      this.editRoleDialogVisible = true;
      this.getRole(role.id);
    },
    clickEditRole() {
      this.editRole();
      this.editRoleDialogVisible = false;
    },
    clickDeleteRoleBtn(id) {
      this.$confirm("是否删除该角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.removeRole(id);
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
    clickAllotBtn(role) {
      this.allotRightDialogVisible = true;
			this.getRightList(role);
			this.roleId = role.id
    },
    getLeafKeys(node, arr) {
      if (!node.children) return arr.push(node.id);

      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    closeAllotDialog() {
      this.checkedKeys = [];
    },
    clickAllotRight() {
			this.allotRight()
		}
  },
};
</script>

<style lang="less" scoped>
.el-card {
  display: flex;
  padding-top: 8px;
}
.el-table {
  justify-content: center;
}
.el-row .el-tag {
  margin: 10px 5px 10px 0;
}
.btop {
  border-top: 1px solid #eee;
}
.bbottom {
  border-bottom: 1px solid #eee;
}
.el-table {
  margin: 18px 0;
  overflow-x: hidden;
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
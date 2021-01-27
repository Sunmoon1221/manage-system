<template>
  <div class="params">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-alert title="请选择三级分类" type="info" show-icon> </el-alert>

      <el-cascader
        v-model="selectCate"
        :options="cateList"
        :props="cascaderProps"
        @change="handleChange"
        style="width: 300px; margin-top: 20px"
      ></el-cascader>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            round
            :disabled="btnDisabled"
            @click="clickAddParamBtn"
            >添加参数</el-button
          >
          <el-table :data="manyTable" style="width: 100%">
            <el-table-column type="expand">
              <!--展开行数据 -->
              <template v-slot="scope">
                <el-tag
                  class="valsTag"
                  :key="index"
                  v-for="(tag, index) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag, scope.row)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                  style="width: 200px"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ 选项</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="设置">
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
                    @click="clickDeleteBtn(scope.row.attr_id)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button
            type="primary"
            round
            :disabled="btnDisabled"
            @click="clickAddParamBtn"
            >添加参数</el-button
          >
          <el-table :data="onlyTable" style="width: 100%">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  class="valsTag"
                  :key="index"
                  v-for="(tag, index) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag, scope.row)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                  style="width: 200px"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ 选项</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="设置">
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
                    @click="clickDeleteBtn(scope.row.attr_id)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加参数对话框 -->
      <el-dialog
        :title="'添加' + titleText"
        :visible.sync="addParamDialogVisible"
        width="50%"
        @close="closeAddParamDialog"
      >
        <el-form
          :model="addParamsForm"
          :rules="addParamsFormRules"
          ref="addParamsFormRef"
          label-width="80px"
          class="demo-ruleForm"
          @close="closeAddParamsForm"
        >
          <el-form-item :label="titleText" prop="attr_name">
            <el-input
              v-model="addParamsForm.attr_name"
              style="width: 80%"
            ></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button round @click="addParamDialogVisible = false"
            >取 消</el-button
          >
          <el-button round type="primary" @click="clickAddParams"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 修改参数对话框 -->
      <el-dialog title="修改信息" :visible.sync="editDialogVisible" width="50%">
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="80px"
          class="demo-ruleForm"
          @close="closeEditForm"
        >
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button round @click="editDialogVisible = false">取 消</el-button>
          <el-button round type="primary" @click="clickEdit">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getCategories } from "@/network/goodCate";
import {
  getParams,
  postAddParams,
  deleteParams,
  getParamsById,
  putEditParams,
} from "@/network/params";
export default {
  // TODO
  data() {
    return {
      cateList: [],
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectCate: [],
      activeName: "many",
      currentCateId: 0,
      onlyTable: [],
      manyTable: [],
      //添加参数
      addParamDialogVisible: false,
      addParamsForm: {
        attr_name: "",
      },
      addParamsFormRules: {
        attr_name: [
          { required: true, message: "参数名称不能为空", trigger: "blur" },
        ],
      },
      // 修改参数
      editDialogVisible: false,
      editForm: {
        attr_name: "",
      },
      editFormRules: {
        attr_name: [
          { required: true, message: "参数名称不能为空", trigger: "blur" },
        ],
      },
      attr_id: 0,
      // test
      // inputVisible: false,
      // inputValue: "",
    };
  },
  created() {
    this.getCategory();
  },
  methods: {
    async getCategory() {
      const { data: res } = await getCategories();
      if (res.meta.status !== 200)
        return this.$message.error("获取分类列表失败");
      this.cateList = res.data;
      console.log(this.cateList);
    },
    async getParamsList() {
      let id = this.currentCateId;
      let url = `categories/${id}/attributes`;
      const { data: res } = await getParams(url, {
        sel: this.activeName,
      });
      if (res.meta.status !== 200) return this.$message.error("获取参数失败");
      if (this.activeName === "only") {
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          item.inputVisible = false;
          item.inputValue = "";
        });
        this.onlyTable = res.data;
        console.log(this.onlyTable);
      } else {
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
          item.inputVisible = false;
          item.inputValue = "";
        });
        this.manyTable = res.data;
        console.log(res);
      }
    },
    async addParams() {
      let id = this.currentCateId;
      let url = `categories/${id}/attributes`;
      const dataForm = {
        attr_name: this.addParamsForm.attr_name,
        attr_sel: this.activeName,
        attr_vals: "",
      };
      const { data: res } = await postAddParams(url, dataForm);
      if (res.meta.status !== 201) return this.$message.error("添加参数失败");
      this.getParamsList();
    },
    async deleteParam(attrid) {
      let id = this.currentCateId;
      let url = `categories/${id}/attributes/${attrid}`;
      const { data: res } = await deleteParams(url);
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.getParamsList();
      console.log(res);
    },
    async getParamById(attrId) {
      let id = this.currentCateId;
      let url = `categories/${id}/attributes/${attrId}`;

      const params = {
        attr_sel: this.activeName,
        attr_vals: "",
      };
      const { data: res } = await getParamsById(url, params);
      if (res.meta.status !== 200) return this.$message.error("获取属性名失败");
      this.editForm.attr_name = res.data.attr_name;
    },
    // 修改参数
    async editParam() {
      let id = this.currentCateId;
      let url = `categories/${id}/attributes/${this.attrId}`;
      const dataForm = {
        attr_name: this.editForm.attr_name,
        attr_sel: this.activeName,
        attr_vals: "",
      };
      const { data: res } = await putEditParams(url, dataForm);
      if (res.meta.status !== 200) return this.$message.error("修改失败");
      this.getParamsList();
      console.log(res);
    },
    // 修改属性
    async editAttr(attr) {
      console.log(attr);
      let id = this.currentCateId;
			let url = `categories/${id}/attributes/${attr.attr_id}`;
			let attrVals = this.activeName === 'many' ? attr.attr_vals.join(",") : attr.attr_vals.join(" ")
      const dataForm = {
        attr_name: attr.attr_name,
        attr_sel: this.activeName,
        attr_vals: attrVals
      };
      const { data: res } = await putEditParams(url, dataForm);
      if (res.meta.status !== 200) return this.$message.error("修改失败");
    },
    handleChange(value) {
      if (this.selectCate.length === 3) {
        this.currentCateId = this.selectCate[2];
        this.getParamsList();
      }
      (this.manyTable = []), (this.onlyTable = []);
    },
    handleClick(tab, event) {
      // console.log(tab);
    },
    // 修改
    clickEditBtn(param) {
      this.attrId = param.attr_id;
      this.getParamById(param.attr_id);
      this.editDialogVisible = true;
    },
    closeEditForm() {},
    clickEdit() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return;
        this.editParam();
        this.editDialogVisible = false;
      });
    },
    // 删除
    clickDeleteBtn(id) {
      this.$confirm("是否删除该参数?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteParam(id);
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
    // 添加参数
    clickAddParamBtn() {
      this.addParamDialogVisible = true;
    },
    closeAddParamDialog() {
      this.$refs.addParamsFormRef.resetFields();
    },
    closeAddParamsForm() {},
    clickAddParams() {
      this.$refs.addParamsFormRef.validate((valid) => {
        if (!valid) return;
        this.addParams();
        this.addParamDialogVisible = false;
      });
    },
    handleClose(tag, attr) {
      console.log(attr);
      attr.attr_vals.splice(attr.attr_vals.indexOf(tag), 1);
      // 删除选项
      this.editAttr(attr);
    },

    showInput(param) {
      param.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm(param) {
      let inputValue = param.inputValue.trim();
      if (inputValue.length === 0) {
        param.inputVisible = false;
        param.inputValue = "";
        return;
      }
      param.attr_vals.push(inputValue);
      this.editAttr(param);
      // 请求添加
      param.inputVisible = false;
      param.inputValue = "";
    },
  },
  watch: {
    activeName(newVal, oldVal) {
      if (this.selectCate.length === 3) {
        this.getParamsList();
      } else this.$message.info("请选择分类");
    },
  },
  computed: {
    btnDisabled() {
      return this.selectCate.length !== 3 ? true : false;
    },
    titleText() {
      return this.activeName === "many" ? "动态参数" : "静态参数";
    },
  },
};
</script>

<style>
.el-scrollbar {
  height: 300px;
}
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.valsTag {
  margin: 0 10px 20px 0;
}
</style>
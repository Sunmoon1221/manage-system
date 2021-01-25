<template>
  <div class="goos-cate">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-col :span="3" :offset="21"
          ><el-button
            type="primary"
            size="medium"
            round
            class="addCateBtn"
            @click="clickAddCateBtn"
            >添加分类</el-button
          ></el-col
        >
      </el-row>

      <el-table
        :data="cateList"
        style="width: 100%; margin-bottom: 20px"
        row-key="cat_id"
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="cat_name" label="分类名称" sortable width="180">
        </el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效" width="180">
          <template v-slot="scope">
            <i
              class="el-icon-success"
              style="color: #66b1ff"
              v-if="!scope.row.cat_deleted"
            ></i>
            <i class="el-icon-error" v-else></i>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="权限等级" width="180">
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
                @click="clickDeleteBtn(scope.row.cat_id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        lazy
      >
      </el-pagination>

      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%"
        @close="closeAddCateDialog"
      >
        <el-form
          :model="addCateForm"
          :rules="addCateFormRules"
          ref="addCateFormRef"
          label-width="80px"
          class="demo-ruleForm"
          @close="closeAddCateForm"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="选择父级">
            <el-cascader
              v-model="selectCate"
              :options="cateL2List"
              @change="handleChange"
              :props="cascaderProps"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button round @click="addCateDialogVisible = false"
            >取 消</el-button
          >
          <el-button round type="primary" @click="clickAddCate"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 修改分类对话框 -->
      <el-dialog
        title="修改信息"
        :visible.sync="editCateDialogVisible"
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
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button round @click="editCateDialogVisible = false"
            >取 消</el-button
          >
          <el-button round type="primary" @click="clickEdit"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// TODO
import {
  getCategories,
  postAddCategories,
  deleteCategories,
  putEditCategories,
  getCategoryById,
} from "@/network/goodCate";
export default {
  data() {
    return {
      queryInfo: {
        type: "",
        pagenum: 1,
        pagesize: 5,
      },
      cateList: [],
      total: 0,
      cateL2List: [],

      addCateDialogVisible: false,
      addCateForm: {
        cat_name: "",
        cat_level: 0,
        cat_pid: 0,
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "分类名称不能为空", trigger: "blur" },
        ],
      },
      selectCate: [],
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true,
      },

      editCateDialogVisible: false,
      editForm: {
        cat_name: "",
      },
      editFormRules: {
        cat_name: [
          { required: true, message: "分类名不能为空", trigger: "blur" },
        ],
			},
			currentCateId: 0
    };
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    async getCategoryList() {
      this.queryInfo.type = 3;
      const { data: res } = await getCategories(this.queryInfo);
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类列表失败");
      this.cateList = res.data.result;
      this.total = res.data.total;
      console.log(this.cateList);
    },
    async getCateL2List() {
      const { data: res } = await getCategories({ type: 2 });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类列表失败");
      this.cateL2List = res.data;
      console.log(this.cateL2List);
    },
    async addCategory() {
      console.log(this.addCateForm);
      const { data: res } = await postAddCategories(this.addCateForm);
      if (res.meta.status !== 201) return this.$message.error("添加分类失败");
      this.getCategoryList();
      console.log(res);
    },
    async deleteCategory(id) {
      let url = `categories/${id}`;
      const { data: res } = await deleteCategories(url);
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.getCategoryList();
    },
    async getCateById(id) {
      let url = `categories/${id}`;
      const { data: res } = await getCategoryById(url);
			if(res.meta.status !== 200) return this.$message.error('获取分类名称失败')
			this.editForm.cat_name = res.data.cat_name
			this.cat_id = res.data.cat_id
    },

    async editCategory() {
			let id = this.cat_id
    	let url = `categories/${id}`
    	// TODO
			const {data: res} = await putEditCategories(url,{cat_name: this.editForm.cat_name})
			if(res.meta.status !== 200) return this.$message.error('修改失败')
			this.getCategoryList()
    },

    // 添加分类
    clickAddCateBtn() {
      this.getCateL2List();
      this.addCateDialogVisible = true;
    },
    closeAddCateDialog() {
      this.$refs.addCateFormRef.resetFields();
      this.selectCate = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    clickAddCate() {
      if (this.selectCate.length > 0) {
        // console.log(this.selectCate[0])
        // let arr = [...this.selectCate]
        let length = this.selectCate.length;
        this.addCateForm.cat_pid = this.selectCate[length - 1];
        this.addCateForm.cat_level = this.selectCate.length;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
      this.$refs.addCateFormRef.validate((valid) => {
        if (!valid) return;
        this.addCategory();
        this.addCateDialogVisible = false;
      });
    },
    closeAddCateForm() {},
    handleChange(value) {
      console.log(value);
    },
    // 编辑
    clickEditBtn(cate) {
			console.log(cate);
			this.getCateById(cate.cat_id)
			this.editCateDialogVisible = true;
    },
		closeEditForm() {},
		clickEdit() {
			this.editCategory()
			this.editCateDialogVisible = false
		},
    // 删除
    clickDeleteBtn(id) {
      this.$confirm("是否删除该分类?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteCategory(id);
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

    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getCategoryList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getCategoryList();
    },
  },
};
</script>

<style>
.el-table {
  margin-top: 20px;
  margin-bottom: 20px;
}
.el-scrollbar {
  height: 300px;
}
</style>
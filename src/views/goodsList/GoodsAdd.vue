<template>
  <div class="goods-add">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>

      <el-steps :active="parseInt(activeIndex)" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        label-position="top"
        :model="addGoodForm"
        :rules="addGoodFormRules"
        ref="addGoodFormRef"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          @tab-click="handleClick"
          :before-leave="beforeTabLeave"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="selectCate"
                :options="cateList"
                :props="cascaderProps"
                @change="handleChange"
                style="width: 300px"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTable"
              :key="item.attr_id"
            >
              <!-- <el-checkbox-group v-model="item.attr_vals"> -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(item, index) in item.attr_vals"
                  :label="item"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTable"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
              :headers="uploadHeader"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过2M
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              ref="myQuillEditor"
              v-model="addGoodForm.goods_introduce"
            />
            <el-button type="primary" class="addBtn" @click="clickAddGoodBtn">
              添加商品
            </el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <el-dialog title="预览图片" :visible.sync="previewDialog" width="50%">
        <img :src="previewUrl" alt="" style="width: 100%" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getCategories } from "@/network/goodCate";
import { getParams } from "@/network/params";
import { postUploadPicture } from "@/network/upload";
import { postAddGoods } from "@/network/goods";
import _ from "lodash";
export default {
  data() {
    return {
      activeIndex: "0",
      addGoodForm: {
        goods_name: "",
        goods_cat: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        attrs: [],
        pics: [],
        goods_introduce: "",
      },
      addGoodFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
      },
      // 分类列表
      cateList: [],
      // 选中的分类列表
      selectCate: [],
      cascaderProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      manyTable: [],
      onlyTable: [],
      fileList: [],
      uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      uploadHeader: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewUrl: "",
      previewDialog: false,
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await getCategories();
      this.cateList = res.data;
    },
    async getParam(type) {
      let id = this.selectCate[2];
      let url = `categories/${id}/attributes`;
      const { data: res } = await getParams(url, { sel: type });
      if (type === "many") {
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
        });
        this.manyTable = res.data;
      } else {
        // res.data.forEach((item) => {
        //   item.attr_vals = item.attr_vals = item.attr_vals
        //     ? item.attr_vals.split(" ")
        //     : [];
        // });
        this.onlyTable = res.data;
      }

      console.log(this.manyTable);
      console.log(this.onlyTable);
		},
		async addGoods(dataForm) {
			const {data: res} = await postAddGoods(dataForm)
			if(res.meta.status !== 201) return this.$message.error('添加商品失败')
			this.$message.success('添加成功')
			this.$router.push('/goods')
			console.log(res)
		},
    // async uploadPicture(file) {
    // 	const { data: res } = await postUploadPicture(file);
    // 	if(res.meta.status !== 200) return this.$message.error('上传图片失败')
    // 	const pic = {
    // 		"pic": res.data.tmp_path
    // 	}
    // 	this.addGoodForm.pics.push(pic)
    // 	console.log(this.addGoodForm.pics)
    //   console.log(res);
    // },
    // 切换选项卡
    handleClick() {
      if (this.activeIndex === "1") {
        // 请求动态参数
        this.getParam("many");
      } else if (this.activeIndex === "2") {
        // 请求动态参数
        this.getParam("only");
      }
    },
    handleChange() {},
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && [...this.selectCate].length !== 3) {
        this.$message.error("请选择三级分类");
        return false;
      }
    },
    handleRemove(file, fileList) {
      const pic_temp = file.response.data.tmp_path;
      const idx = this.addGoodForm.pics.findIndex(
        (item) => item.pic === pic_temp
      );
      this.addGoodForm.pics.splice(idx, 1);
    },
    handlePreview(file) {
      this.previewUrl = file.response.data.url;
      this.previewDialog = true;
      console.log(this.previewUrl);
    },
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("只能上传jpg或png格式图片");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("只能上传小于2M图片");
      }
      return isJpgOrPng && isLt2M;
    },
    // 上传图片
    // uploadPic(data) {
    //   const formData = new FormData();
    //   formData.append("file", data.file);

    // 	this.uploadPicture(formData);
    // 	this.$message.success('上传图片成功')
    // },
    handleSuccess(res) {
      const pic = {
        pic: res.data.tmp_path,
      };

      this.addGoodForm.pics.push(pic);
      console.log(this.addGoodForm.pics);
    },
    clickAddGoodBtn() {
      this.$refs.addGoodFormRef.validate((valid) => {
        if (!valid) return;
        // 整理数据
        // 1.整理分类
        this.addGoodForm.goods_cat = this.selectCate;
        const formData = _.cloneDeep(this.addGoodForm);
        formData.goods_cat = formData.goods_cat.join(",");
        // 2.整理参数和属性
        this.manyTable.forEach((item) => {
          formData.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          });
        });
        this.onlyTable.forEach((item) => {
          formData.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          });
				});
				this.addGoods(formData)
			});
			
		

      
    },
  },
};
</script>

<style>
.el-scrollbar {
  height: 300px;
}
.el-cascader-menu__wrap {
  overflow-x: hidden;
}
.el-checkbox {
  margin: 5px 5px 0 0 !important;
}
.ql-editor {
  height: 300px;
}
.el-steps {
	margin:  40px 0 40px 0;
}
.addBtn {
	margin-top: 20px;
}
</style>
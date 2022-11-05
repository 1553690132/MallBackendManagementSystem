<template>
  <div>
    <breadcrumb title1="商品管理" title2="添加商品"></breadcrumb>

    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>

      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model.trim="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.trim.number="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.trim.number="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.trim.number="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品种类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                expand-trigger="hover"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
            <el-button type="primary" @click="nextStep">下一步</el-button>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  :label="cb"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-button type="primary" @click="nextStep">下一步</el-button>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
            <el-button type="primary" @click="nextStep">下一步</el-button>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-form-item>
              <!-- action图片上传地址 -->
              <el-upload
                :action="uploadURL"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :headers="headersObj"
                :on-success="handleSuccess"
                list-type="picture"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png文件，且不超过500kb
                </div>
              </el-upload>
            </el-form-item>
            <el-button type="primary" @click="nextStep">下一步</el-button>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="addBtn" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs></el-form
      >
    </el-card>

    <el-dialog title="图片预览" :visible.sync="picDialogVisible" width="50%">
      <el-image :src="previewPath"></el-image>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Add",
  data() {
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属分类数组
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: [],
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "商品名称不能为空!", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "商品价格不能为空!", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "商品重量不能为空!", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "商品数量不能为空!", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类!", trigger: "blur" },
        ],
      },
      cateList: [],
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      manyTableData: [],
      onlyTableData: [],
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      headersObj: {
        // 为图片上传添加 token
        Authorization: window.sessionStorage.getItem("token"),
      },

      picDialogVisible: false,
      previewPath: "",
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    cateId() {
      return this.addForm.goods_cat.length === 3
        ? this.addForm.goods_cat[2]
        : null;
    },
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) return this.$message.error("获取失败!");
      this.cateList = res.data;
    },

    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        return (this.addForm.goods_cat = []);
      }
    },

    beforeTabLeave(activeName, oldActiveName) {
      if (
        oldActiveName === "0" &&
        (this.addForm.goods_cat.length !== 3 || this.addForm.goods_name === "")
      ) {
        this.$message.error("请选择商品分类且商品名称不能为空!");
        return false;
      }
    },

    async tabClicked() {
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("获取动态参数列表失败！");
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals.length
            ? item.attr_vals.split(" ")
            : [];
        });
        this.manyTableData = res.data;
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("获取属性列表失败！");
        this.onlyTableData = res.data;
      }
    },

    handlePreview(file) {
      this.picDialogVisible = true;
      this.previewPath = file.response.data.url;
    },

    handleRemove(file) {
      const path = file.response.data.tmp_path;
      // const index = this.addForm.pics.findIndex((e) => e.pic === path);
      // this.addForm.splice(index, 1);
      this.addForm.pics = this.addForm.pics.filter((e) => {
        return e.pic !== path;
      });
    },

    handleSuccess(response) {
      const picInfo = { pic: response.data.tmp_path };
      this.addForm.pics.push(picInfo);
    },

    addGoods() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        // 深拷贝处理参数问题
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addForm.attrs.push(newInfo);
        });

        this.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addForm.attrs.push(newInfo);
        });

        let form = JSON.parse(JSON.stringify(this.addForm));
        form.goods_cat = form.goods_cat.join(",");

        const { data: res } = await this.$http.post("goods", form);
        if (res.meta.status !== 201)
          return this.$message.error("添加商品失败!");
        this.$message.success("添加商品成功!");
        this.$router.replace("/goods");
      });
    },

    nextStep() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return;
        this.activeIndex = +this.activeIndex + 1 + "";
        this.tabClicked();
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 15px 0 0 !important;
}

.addBtn {
  margin-top: 20px;
}
</style>
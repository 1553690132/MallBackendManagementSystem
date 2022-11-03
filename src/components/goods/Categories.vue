<template>
  <div>
    <breadcrumb title1="商品管理" title2="商品分类"></breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <zk-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-row-hover="false"
        show-index
        index-text="#"
        border
      >
        <template v-slot:isok="scope">
          <i
            v-if="scope.row.cat_deleted"
            class="el-icon-error"
            style="color: red"
          ></i>
          <i v-else class="el-icon-success" style="color: lightgreen"></i>
        </template>
        <template v-slot:order="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level === 1"
            type="success"
            size="mini"
            >二级</el-tag
          >
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>
        <template v-slot:opt="scope" width="300px">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditCateDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </zk-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="90px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model.trim="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- options为数据源、props为配置对象,v-model绑定必须为数组存储选取的id值 -->
          <el-cascader
            :options="parentCateList"
            :props="cascaderProps"
            v-model="selectedKeys"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="40%"
    >
      <el-form
        :model="editCateForm"
        :rules="addCateFormRules"
        label-width="90px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model.trim="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Categories",
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      cateList: [],
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],

      addCateDialogVisible: false,
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      parentCateList: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true,
      },
      selectedKeys: [],

      editCateDialogVisible: false,
      editCateForm: { cat_name: "" },
    };
  },

  created() {
    this.getCateList();
  },

  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类列表失败!");
      this.cateList = res.data.result;
      this.total = res.data.total;
    },

    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },

    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },

    showAddCateDialog() {
      this.addCateDialogVisible = true;
      this.getParentCateList();
    },

    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },

    // 获取前两级分类
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) return this.$message.error("获取分类失败!");
      this.parentCateList = res.data;
    },

    parentCateChanged() {
      if (this.selectedKeys.length) {
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        this.addCateForm.cat_level = this.selectedKeys.length;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },

    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("categories", {
          ...this.addCateForm,
        });
        if (res.meta.status !== 201)
          return this.$message.error("添加分类失败!");
        this.$message.success("添加分类成功!");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },

    async showEditCateDialog(id) {
      const { data: res } = await this.$http.get(`categories/${id}`);
      if (res.meta.status !== 200) return this.$message.error("获取信息失败!");
      this.editCateForm = res.data;
      this.editCateDialogVisible = true;
    },

    async editCate() {
      const { data: res } = await this.$http.put(
        `categories/${this.editCateForm.cat_id}`,
        { ...this.editCateForm }
      );
      if (res.meta.status !== 200)
        return this.$message.error("提交更新分类失败!");
      this.$message.success("提交更新分类成功!");
      this.getCateList();
      this.editCateDialogVisible = false;
    },

    async deleteCate(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("取消删除");

      const { data: res } = await this.$http.delete(`categories/${id}`);
      if (res.meta.status !== 200) return this.$message.error("删除失败!");
      this.$message.success("删除成功!");
      this.getCateList();
    },
  },
};
</script>

<style lang="less" scoped>
.el-table {
  font-size: 12px;
  color: #000;
}

.zk-table {
  margin: 20px 0;
}
.el-cascader {
  width: 100%;
}
</style>
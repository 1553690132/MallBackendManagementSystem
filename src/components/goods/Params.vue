<template>
  <div>
    <breadcrumb title1="商品管理" title2="分类参数"></breadcrumb>

    <el-card>
      <el-alert
        title="注意:只允许对第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="addParamsDialogVisible = true"
            >添加参数</el-button
          >
          <el-table :data="manyTableData" border stripe>
            <el-table-column v-if="manyTableData.length" type="expand"
              ><template v-slot="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model.trim="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作" v-slot="scope">
              <template>
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="addParamsDialogVisible = true"
            >添加属性</el-button
          >
          <el-table :data="onlyTableData" border stripe>
            <el-table-column v-if="manyTableData.length" type="expand"
              ><template v-slot="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model.trim="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作" v-slot="scope">
              <template>
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addParamsDialogVisible"
      width="50%"
      @close="addParamsDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="90px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="'编辑' + titleText"
      :visible.sync="editParamsDialogVisible"
      width="50%"
    >
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="90px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      cateList: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      selectedCateKeys: [],
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      addParamsDialogVisible: false,
      addForm: { attr_name: "" },
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入名称!", trigger: "blur" },
        ],
      },

      editParamsDialogVisible: false,
      editForm: {},
    };
  },

  computed: {
    isDisabled() {
      return this.selectedCateKeys.length !== 3;
    },
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    titleText() {
      return this.activeName === "many" ? "动态参数" : "静态属性";
    },
  },

  created() {
    this.getCateList();
  },

  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取分类信息失败!");
      this.cateList = res.data;
    },

    async handleChange() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      if (res.meta.status !== 200) return this.$message.error("获取信息失败!");

      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        this.$set(item, "inputVisible", false);
        this.$set(item, "inputValue", "");
      });

      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },

    // 切换面板重新发出请求
    handleTabClick() {
      this.handleChange();
    },

    addParamsDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },

    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          { ...this.addForm, attr_sel: this.activeName }
        );
        if (res.meta.status !== 201)
          return this.$message.error("添加参数失败!");
        this.$message.success("添加参数成功!");
        this.handleChange();
        this.addParamsDialogVisible = false;
      });
    },

    async showEditDialog(attr_id) {
      this.editParamsDialogVisible = true;
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        { params: { attr_sel: this.activeName } }
      );
      if (res.meta.status !== 200) return this.$message.error("获取失败!");
      this.editForm = res.data;
    },

    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { ...this.editForm }
        );
        if (res.meta.status !== 200)
          return this.$message.error("编辑更新失败!");
        this.$message.success("更新成功!");
        this.handleChange();
        this.editParamsDialogVisible = false;
      });
    },

    async removeParams(attr_id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("取消删除");

      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      if (res.meta.status !== 200) return this.$message.error("删除失败!");
      this.$message.success("删除成功!");
      this.handleChange();
    },

    async handleInputConfirm(row) {
      row.attr_vals.push(row.inputValue);
      row.inputValue = "";
      row.inputVisible = false;
      this.saveAttrVals(row);
    },

    showInput(row) {
      row.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("修改失败!");
      this.$message.success("修改成功!");
      this.handleChange();
    },

    handleClose(index, row) {
      row.attr_vals.splice(index, 1);
      this.saveAttrVals(row);
    },
  },
};
</script>

<style lang="less" scoped>
.el-row {
  margin: 20px 0;
}
span {
  margin-right: 20px;
}
.el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 120px;
}
</style>
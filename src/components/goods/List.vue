<template>
  <div>
    <breadcrumb title1="商品管理" title2="商品列表"></breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
            @keyup.enter.native="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" class="addGoodsBtn" @click="goAddPage"
            >添加商品</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="价格(元)"
          width="110px"
          prop="goods_price"
        ></el-table-column>
        <el-table-column
          label="商品数量"
          width="90px"
          prop="goods_number"
        ></el-table-column>
        <el-table-column label="创建时间" width="160px" prop="add_time">
          <template v-slot="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditGoodsDialog(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
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

    <el-dialog title="修改商品" :visible.sync="editDialogVisible" width="40%">
      <el-form
        :model="editGoodsForm"
        ref="editGoodsRef"
        :rules="editGoodsRules"
        label-position="right"
        label-width="90px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model.trim="editGoodsForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)" prop="goods_price">
          <el-input v-model.trim="editGoodsForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model.trim="editGoodsForm.goods_number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "List",
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      goodsList: [],

      editDialogVisible: false,
      editGoodsForm: {},
      editGoodsRules: {
        goods_name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "商品价格不能为空", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "商品数量不能为空", trigger: "blur" },
        ],
      },
      cateId: 0,
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: { ...this.queryInfo },
      });
      if (res.meta.status !== 200) return this.$message.error("查询失败!");
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },

    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },

    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getGoodsList();
    },

    async showEditGoodsDialog(id) {
      const { data: res } = await this.$http.get(`goods/${id}`);
      if (res.meta.status !== 200) return this.$message.error("查询失败!");
      this.editGoodsForm = res.data;
      this.cateId = id;
      this.editDialogVisible = true;
    },

    async deleteGoods(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("取消删除");

      const { data: res } = await this.$http.delete(`goods/${id}`);
      if (res.meta.status !== 200) return this.$message.error("删除失败!");
      this.$message.success("删除成功!");
      this.getGoodsList();
    },

    editGoods() {
      this.$refs.editGoodsRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `goods/${this.cateId}`,
          this.editGoodsForm
        );
        if (res.meta.status !== 200) return this.$message.error("编辑失败!");
        this.$message.success("编辑成功!");
        this.getGoodsList();
        this.editDialogVisible = false;
      });
    },

    goAddPage() {
      this.$router.push("/goods/add");
    },
  },
};
</script>

<style lang="less" scoped>
.addGoodsBtn {
  margin-left: 20px;
}

.el-table {
  margin: 20px 0;
}
</style>
<template>
  <div>
    <breadcrumb title1="权限管理" title2="权限列表"></breadcrumb>

    <el-card class="box-card">
      <el-table :data="typeList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success"
              >二级</el-tag
            >
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",

  data() {
    return {
      typeList: [],
    };
  },

  created() {
    this.getTypeList();
  },

  methods: {
    async getTypeList() {
      const { data: res } = await this.$http.get("rights/list");
      if (res.meta.status !== 200) return this.$message.error("获取列表失败!");
      console.log(res);
      this.typeList = res.data;
    },
  },
};
</script>

<style lang="less" scoped>
</style>
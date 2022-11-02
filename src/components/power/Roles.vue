<template>
  <div>
    <breadcrumb title1="权限管理" title2="角色列表"></breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="roleList" border stripe>
        <el-table-column type="expand" v-slot="scope">
          <template>
            <el-row
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
              :class="[index1 === 0 ? 'bdtop' : '', 'bdbottom', 'el-center']"
            >
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="[index2 === 0 ? '' : 'bdtop']"
                >
                  <el-col :span="8">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      type="success"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <el-tag
                      closable
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" v-slot="scope" width="300px">
          <template>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditRole(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%">
      <el-form
        :model="editRoleForm"
        ref="editRoleRef"
        :rules="editRoleRules"
        label-position="right"
        label-width="90px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model.trim="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model.trim="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightClosed"
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",

  data() {
    return {
      roleList: [],
      editRoleForm: {
        roleId: "",
        roleName: "",
        roleDesc: "",
      },
      editDialogVisible: false,
      editRoleRules: {
        roleName: [
          { required: true, message: "角色名不能为空!" },
          { min: 2, max: 10, message: "角色名应在2到10个字符间" },
        ],
        roleDesc: [{ required: true, message: "角色描述不能为空!" }],
      },
      setRightDialogVisible: false,
      rightsList: [],
      treeProps: {
        children: "children",
        label: "authName",
      },
      defKeys: [],
      nowId: 0,
    };
  },

  created() {
    this.getRolesList();
  },

  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) return this.$message.error("获取失败!");
      this.roleList = res.data;
    },

    async showEditRole(id) {
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get(`roles/${id}`);
      if (res.meta.status !== 200) return this.$message.error("获取信息失败!");
      this.editRoleForm = { ...res.data };
    },

    editRole() {
      this.$refs.editRoleRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `roles/${this.editRoleForm.roleId}`,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc,
          }
        );
        if (res.meta.status !== 200) return this.$message.error("修改失败!");
        this.$message.success("修改成功!");
        this.editDialogVisible = false;
        this.getRolesList();
      });
    },

    async deleteRole(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("取消删除");

      const { data: res } = await this.$http.delete(`roles/${id}`);
      if (res.meta.status !== 200) return this.$message.error("删除失败!");
      this.$message.success("删除成功!");
      this.getRolesList();
    },

    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm("确定删除该权限?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("取消删除");

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) return this.$message.error("取消权限失败!");
      this.$message.success("删除成功!");
      // 在此局部赋值，不会造成整体刷新表单合上
      role.children = res.data;
    },

    async showSetRightDialog(role) {
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) return this.$message.error("获取失败!");
      this.rightsList = res.data;
      this.getLeafKeys(role, this.defKeys);
      this.setRightDialogVisible = true;
      this.nowId = role.id;
    },

    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },

    setRightClosed() {
      this.defKeys = [];
    },

    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const rids = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.nowId}/rights`,
        { rids }
      );
      if (res.meta.status !== 200) return this.$message.error("更新失败!");
      this.$message.success("更新成功!");
      this.getRolesList();
      this.setRightDialogVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px;
}

.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}

.el-row {
  display: flex;
  align-items: center;
}
</style>
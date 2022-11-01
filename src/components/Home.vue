<template>
  <el-container class="home-container">
    <el-header>
      <div class="left-part">
        <img src="../assets/logo.png" alt="logo" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="exit">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="width">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="`${item.id}`"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="`/${subItem.path}`"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      menuList: [],
      iconList: {
        125: "el-icon-user-solid",
        103: "el-icon-s-platform",
        101: "el-icon-s-goods",
        102: "el-icon-s-order",
        145: "el-icon-s-marketing",
      },
      isCollapse: false,
    };
  },

  computed: {
    width() {
      return this.isCollapse ? "64px" : "200px";
    },
    activePath(){
      return this.$route.path
    },
  },

  created() {
    this.getMenuList();
  },
  methods: {
    exit() {
      sessionStorage.removeItem("token");
      this.$router.replace("/login");
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left-part {
      display: flex;
      height: 100%;
      align-items: center;
    }
    img {
      height: 100%;
      width: auto;
    }
    span {
      color: #fff;
      font-size: 20px;
      margin-left: 10px;
    }
  }
  .el-aside {
    background-color: #333744;
    transition: all 0.3s;
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: #f2f6fc;
  }
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
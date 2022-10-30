<template>
  <div>
    <div>主页</div>
    <el-button type="danger" @click="exit">退出登录</el-button>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    exit() {
      sessionStorage.removeItem("token");
      this.$router.replace("/login");
    },
  },
};
</script>

<style>
</style>
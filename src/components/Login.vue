<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="logo" />
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        label-width="0px"
        class="login_form"
      >
        <el-form-item prop="username">
          <el-input
            v-model.trim="loginForm.username"
            prefix-icon="el-icon-user"
            @keyup.enter.native="login"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model.trim="loginForm.password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            show-password
            @keyup.enter.native="login"
          ></el-input>
        </el-form-item>

        <el-form-item class="btns">
          <el-button type="primary" plain @click="login">登录</el-button>
          <el-button type="info" plain @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          // trigger为触发时机
          { required: true, message: "请输入账号!", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "账号长度应该在3到10个字符内!",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "密码不能为空!", trigger: "blur" },
          {
            min: 4,
            max: 12,
            message: "密码长度应该在4到12个字符内!",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      // 通过async+await简化Promise的then直接取出data
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm);
        if (res.meta.status !== 200) return this.$message.error("登录失败!");
        this.$message.success("登录成功!");
        // 保存Token至sessionStorage
        sessionStorage.setItem("token", res.data.token);
        this.$router.replace("/home");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #409eff;
  height: 100%;

  .login_box {
    position: absolute;
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 4px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
      position: absolute;
      height: 90px;
      width: 90px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: auto;
        border-radius: 50%;
        background-color: #eee;
      }
    }

    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 30px;
      box-sizing: border-box;
    }

    .btns {
      display: flex;
      justify-content: end;
    }
  }
}
</style>
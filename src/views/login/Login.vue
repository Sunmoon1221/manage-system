<template>
  <div>
    <div class="login-box">
      <img class="logo" src="../../assets/image/login/head-logo2.png" alt="" />
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
        label-width="100px"
        class="login-form"
      >
        <el-form-item label="用户名" label-width="70px" prop="username">
          <el-input v-model="loginForm.username" clearable> </el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="70px" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label-width="0px" class="button-area">
          <el-button type="primary" size="medium" @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { postLoginForm } from "@/network/login";
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate(async valid => {
				if (!valid) return;
				const {data: res} = await postLoginForm(this.loginForm)
				if(res.meta.status !== 200) return this.$message.error('登录失败')
				window.sessionStorage.setItem('token',res.data.token)
				this.$router.replace('/home')
				this.$message.success('登录成功')
      });
    },
  },
};
</script>

<style lang="less" scope>
body {
  background-color: #2bb1e8;
  position: relative;
  height: 100vh;
}
// login box
.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 456px;
  height: 300px;
  background-color: #fff;
  box-shadow: 0 0 40px #0000003d;
  border-radius: 10px;

  .logo {
    width: 300px;
    position: absolute;
    top: -24%;
    left: 50%;
    transform: translateX(-50%);
  }
}

// form box
.login-form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -30%);
  width: 80%;
  // background-color: red;

  .button-area {
    text-align: center;

    button {
      background-color: #2bb1e8;
    }

    span {
      padding: 0 50px;
    }
  }
}
</style>
<template >
  <div class="login-container">
    <div id="e_background">
      <div id="e_smallstars"></div>
      <div id="e_moon"></div>
    </div>
    <div class="login-box">
      <div class="login-logo">
        <img src="../assets/img/bg.jpg">
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" @keyup.enter.native="login" clearable>
            <i slot="prefix" class="iconfont icon-huangguan"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" @keyup.enter.native="login" show-password>
            <i slot="prefix" class="iconfont icon-mima"></i>
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :push="14">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单数据
      loginForm: {
        username: '',
        password: ''
      },
      // 登录表单验证格式
      loginFormRules: {
        username: [{ required: true, message: '用户名必填', trriger: 'blur' }],
        password: [{ required: true, message: '密码必填', trriger: 'blur' }]
      }
    }
  },
  methods: {
    // 登录验证
    login() {
      this.$refs.loginFormRef.validate( async valid =>{
        if(!valid) return false;
        // var dd=JSON.stringify(this.loginForm)
        // const {data:dt}=await this.$http.post("login",dd)
      //   const {data:dt}=await this.$http.post("login",this.loginForm)
      // console.log(dt)
      var params = new URLSearchParams()
      params.append('username', this.loginForm.username) //你要传给后台的参数值 key/value
      params.append('password', this.loginForm.password)
      // this.$http({
      //   method: 'post',
      //   url: "/login",
      //   data: params
      // }).then(res => {
      //   console.log(res)
      // })
      const {data:dt}=await this.$http.post("login",params)
      // console.log(dt)
      if(dt.meta.status!==200) return this.$message.error(dt.meta.msg);
      this.$message.success(dt.meta.msg);
      window.sessionStorage.setItem("token",dt.data.token)
      window.sessionStorage.setItem("userid",dt.data.id)
      this.$router.push("/home")
      })
    },
    reset() {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less">
.login-container {
  height: 100%;
  // background-image: linear-gradient(120deg, #900, #f00);
  .login-box {
    width: 450px;
    height: 310px;
    background: rgba(240, 240, 240, 0.8);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    .login-logo {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      overflow: hidden;
      padding: 10px;
      background-color: #fff;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      z-index: 5;
      top: -75px;
      border: 1px solid #eee;
      box-shadow: 0 0 10px #eee;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .el-form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 40px;
      box-sizing: border-box;
      .icon-huangguan {
        color: #c00;
      }
      .icon-mima {
        color: #c00;
      }
    }
  }
}
</style>
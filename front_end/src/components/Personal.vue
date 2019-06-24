<template >
  <div>
    <com-crumb n1="个人中心" n2="个人信息"></com-crumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>我的个人信息</span>
      </div>
      <el-form
        :model="userInfo"
        :rules="userInforules"
        ref="editUserInfoRef"
        label-width="90px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="userInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :offset="2">
          <el-button type="warning" @click="editUserInfo">更 新</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getUserInfo()
  },
  data() {
    // 检验邮箱格式
    var checkEmail = (rule, value, callback) => {
      var reg = /^\w+@\w+\.\w+$/
      if (!reg.test(value)) {
        callback(new Error('请输入正确邮箱格式'))
      } else {
        callback()
      }
    }
    // 检验电话
    var checkMobile = (rule, value, callback) => {
      var reg = /^[1][35678][0-9]{9}$/
      if (!reg.test(value)) {
        callback(new Error('请输入正确电话格式'))
      } else {
        callback()
      }
    }
    return {
      userInfo: {},
      userInforules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getUserInfo() {
      var id = window.sessionStorage.getItem('userid')
      const { data: dt } = await this.$http.get('/manager/' + id)
      if (dt.meta.status != 200) return this.$message.error('获取个人信息失败')
      this.userInfo = dt.data
    //   console.log(this.userInfo)
    },
    editUserInfo(){
        this.$refs.editUserInfoRef.validate(async valid => {
        if (valid) {
          var params = new URLSearchParams()
          params.append('username', this.userInfo.username)
          params.append('email', this.userInfo.email)
          params.append('mobile', this.userInfo.mobile)
          const { data: dt } = await this.$http.put(
            `/editManager/${this.userInfo.id}`,
            params
          )
          if (dt.meta.status != 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.getUserInfo()
          return this.$message.success(dt.meta.msg)
        }
      })
    }
  }
}
</script>
<style lang = 'less'>
.el-form {
  width: 70%;
  .el-form-item__label {
    color: #fff;
  }
}
</style>

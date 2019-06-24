<template >
  <div>
    <com-crumb n1="个人中心" n2="修改密码"></com-crumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>修改密码</span>
      </div>
      <el-form
        :model="passwordData"
        :rules="passwordrules"
        ref="passwordRef"
        label-width="90px"
        class="demo-ruleForm"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="passwordData.oldPassword" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="passwordData.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="rePassword">
          <el-input type="password" v-model="passwordData.rePassword"></el-input>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :offset="2">
          <el-button type="warning" @click="editPassword">修改密码</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    // 检验新密码和旧密码不一致
    var checkNewPwd = (rule, value, callback) => {
      if (value === this.passwordData.oldPassword) {
        callback(new Error('新密码和旧密码相同'))
      } else {
        callback()
      }
    }
    // 检验重复新密码一致
    var checkNewRePwd = (rule, value, callback) => {
      if (value !== this.passwordData.newPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      passwordData: {
        oldPassword: '',
        newPassword: '',
        rePassword: ''
      },
      passwordrules: {
        oldPassword: [
          { required: true, message: '输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '输入新密码', trigger: 'blur' },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: 'blur'
          },
          { validator: checkNewPwd, trigger: 'blur' }
        ],
        rePassword: [{ validator: checkNewRePwd, trigger: 'blur' }]
      }
    }
  },
  methods: {
    editPassword() {
      this.$refs.passwordRef.validate(async valid => {
        if (valid) {
          var id = window.sessionStorage.getItem('userid')
          var params = new URLSearchParams()
          params.append('oldPassword', this.passwordData.oldPassword)
          params.append('newPassword', this.passwordData.newPassword)
          const { data: dt } = await this.$http.put(
            `/managePassword/${id}`,
            params
          )
          if (dt.meta.status != 200) {
            return this.$message.error(dt.meta.msg)
          }
          window.sessionStorage.removeItem('token')
          window.sessionStorage.removeItem('userid')
          this.$message.success('密码修改成功')
          this.$router.push('/login')
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

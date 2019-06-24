<template >
  <div class="users">
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>-->
    <com-crumb n1="用户管理" n2="用户列表"></com-crumb>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialog"
      width="60%"
      @close="$refs.addUserRef.resetFields()"
    >
      <el-form
        :model="addUserData"
        :rules="addUserrules"
        ref="addUserRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="addUserData.nickname"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserData.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repassword">
          <el-input v-model="addUserData.repassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addUserData.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="addUserData.gender">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
            <el-radio label="保密"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="addUserData.age"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserData.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="addUserData.tel"></el-input>
        </el-form-item>
        <el-form-item label="签名" prop="sign">
          <el-input type="textarea" v-model="addUserData.sign" resize="none"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">添 加</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editUserDialog"
      width="60%"
      @close="$refs.editUserRef.resetFields()"
    >
      <el-form :model="editUserData" :rules="editUserrules" ref="editUserRef" label-width="100px">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="editUserData.nickname" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editUserData.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="editUserData.gender">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
            <el-radio label="保密"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="editUserData.age"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserData.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="editUserData.tel"></el-input>
        </el-form-item>
        <el-form-item label="签名" prop="sign">
          <el-input type="textarea" v-model="editUserData.sign" resize="none"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUser(editUserData.id)">保 存</el-button>
      </span>
    </el-dialog>

    <!-- 修改密码对话框 -->
    <el-dialog
      title="修改用户密码"
      :visible.sync="passwordDialog"
      width="60%"
      @close="$refs.passwordRef.resetFields()"
    >
      <el-form :model="passwordData" :rules="passwordrules" ref="passwordRef" label-width="100px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="passwordData.oldPassword" disabled></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="passwordData.newPassword" clearable></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="rePassword">
          <el-input type="password" v-model="passwordData.rePassword" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passwordDialog = false">取 消</el-button>
        <el-button type="primary" @click="editPassword">保 存</el-button>
      </span>
    </el-dialog>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入要搜索昵称相关内容"
            v-model="userskeywords"
            class="input-with-select search-text"
            clearable
            @clear="searchUsers"
            @keyup.enter.native="searchUsers"
          >
            <el-button slot="append" icon="el-icon-search" class="search-btn" @click="searchUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="warning" plain @click="addUserDialog = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="usersList" border style="width: 100%">
        <el-table-column type="index" label="#" width="40"></el-table-column>
        <el-table-column prop="nickname" label="昵称" width="100"></el-table-column>
        <el-table-column prop="name" label="姓名" width="80"></el-table-column>
        <el-table-column prop="gender" label="性别" width="80"></el-table-column>
        <el-table-column prop="age" label="年龄" width="80"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
        <el-table-column prop="sign" label="签名"></el-table-column>
        <el-table-column prop="tel" label="电话" width="120"></el-table-column>
        <el-table-column label="状态" width="70">
          <template slot-scope="info">
            <el-switch
              v-model="info.row.state"
              active-color="#FFD04B"
              @change="chnageState(info.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="info">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                plain
                round
                @click="editUserDialogOpen(info.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                plain
                round
                @click="delUser(info.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="修改密码"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-setting"
                size="mini"
                plain
                round
                @click="password(info.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        ref="page"
        @size-change="UsershandleSizeChange"
        @current-change="UsershandleCurrentChange"
        :current-page="1"
        :page-sizes="[2, 3, 5, 10]"
        :page-size="3"
        layout="total, sizes, prev, pager, next, jumper"
        :total="usersTotal"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getUserList()
  },
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
    // 检验昵称
    var checkNickname = (rule, value, callback) => {
      var reg = /^\w+$/
      if (!reg.test(value)) {
        callback(new Error('请输入数值或字母(包括下划线)'))
      } else {
        callback()
      }
    }
    // 检验俩次密码是否相同
    var checkRePwd = (rule, value, callback) => {
      if (value !== this.addUserData.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    // 检验年龄
    var checkNum = (rule, value, callback) => {
      var reg = /^\d+$/
      if (!reg.test(value)) {
        callback(new Error('请输入年龄为数值'))
      } else {
        callback()
      }
    }
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
    var checkTel = (rule, value, callback) => {
      var reg = /^[1][35678][0-9]{9}$/
      if (!reg.test(value)) {
        callback(new Error('请输入正确电话格式'))
      } else {
        callback()
      }
    }
    return {
      // 搜索关键字
      userskeywords: '',
      // 用户列表
      usersList: [],
      // 用户总条数
      usersTotal: 0,
      // 获取用户所需参数
      userListParams: {
        query: '',
        pagenum: 1,
        pagesize: 3
      },
      // 添加用户对话框控制
      addUserDialog: false,
      // 添加用户信息
      addUserData: {
        nickname: '',
        password: '',
        repassword: '',
        name: '',
        gender: '保密',
        age: '',
        email: '',
        tel: '',
        sign: ''
      },
      // 添加用户表单检验
      addUserrules: {
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { max: 8, message: '长度最长为 8 个字符', trigger: 'blur' },
          { validator: checkNickname, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        repassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: checkRePwd, trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入名字', trigger: 'blur' }],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' },
          { validator: checkNum, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkTel, trigger: 'blur' }
        ]
      },

      // 编辑用户对话框控制
      editUserDialog: false,
      // 编辑用户信息
      editUserData: {},
      // 编辑用户表单检验
      editUserrules: {
        name: [{ required: true, message: '请输入名字', trigger: 'blur' }],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' },
          { validator: checkNum, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkTel, trigger: 'blur' }
        ]
      },
      // 修改密码
      passwordDialog: false,
      passwordData: {
        id: 0,
        oldPassword: '',
        newPassword: '',
        rePassword: ''
      },
      passwordrules: {
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
    // 获取用户列表
    async getUserList() {
      const { data: dt } = await this.$http.get('/getUser', {
        params: this.userListParams
      })
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.usersList = dt.data.users
      this.usersTotal = dt.data.pagetotal
      if (this.usersList.length == 0) {
        this.userListParams.pagenum = Math.ceil(
          this.usersTotal / this.userListParams.pagesize
        )
        if (this.userListParams.pagenum == 0) {
          this.userListParams.pagenum = 1
        }
        return this.getUserList()
      }
    },
    //   更改每页显示条数
    UsershandleSizeChange(val) {
      // console.log(val)
      this.userListParams.pagesize = val
      this.getUserList()
    },
    //   更改页数
    UsershandleCurrentChange(val) {
      // console.log(val)
      this.userListParams.pagenum = val
      this.getUserList()
    },
    // 搜索用户
    searchUsers() {
      this.userListParams.query = this.userskeywords
      this.getUserList()
    },
    // 添加用户
    addUser() {
      // console.log(this.addUserData)
      this.$refs.addUserRef.validate(async valid => {
        if (valid) {
          var params = new URLSearchParams()
          params.append('nickname', this.addUserData.nickname)
          params.append('password', this.addUserData.password)
          params.append('name', this.addUserData.name)
          params.append('gender', this.addUserData.gender)
          params.append('age', this.addUserData.age)
          params.append('email', this.addUserData.email)
          params.append('tel', this.addUserData.tel)
          params.append('sign', this.addUserData.sign)
          const { data: dt } = await this.$http.post('/addUser', params)
          // console.log(dt)
          if (dt.meta.status != 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.addUserDialog = false
          this.getUserList()
        }
      })
    },
    // 删除用户
    delUser(id) {
      this.$confirm('您确定删除该用户吗?', '删除', {
        confirmButtonText: '是的',
        cancelButtonText: '再想想...',
        type: 'info'
      })
        .then(async () => {
          const { data: dt } = await this.$http.delete(`/delUser/${id}`)
          // console.log(dt)
          if (dt.meta.status != 200) return this.$message.error(dt.meta.msg)
          // // 小bug：最后一页只剩一条删除 删除后数据为空 this.userListParams.pagenum没改变
          // if (this.usersList.length === 1) {
          //   this.userListParams.pagenum--
          // }
          this.getUserList()
          this.$message.success(dt.meta.msg)
        })
        .catch(() => {})
    },
    // 打开编辑用户窗口个
    async editUserDialogOpen(id) {
      this.editUserDialog = true
      const { data: dt } = await this.$http.get(`/user/${id}`)
      // console.log(dt)
      this.editUserData = dt.data
    },
    // 编辑用户
    editUser() {
      this.$refs.editUserRef.validate(async valid => {
        if (valid) {
          var params = new URLSearchParams()
          params.append('name', this.editUserData.name)
          params.append('gender', this.editUserData.gender)
          params.append('age', this.editUserData.age)
          params.append('email', this.editUserData.email)
          params.append('tel', this.editUserData.tel)
          params.append('sign', this.editUserData.sign)
          const { data: dt } = await this.$http.put(
            `/editUser/${this.editUserData.id}`,
            params
          )
          // console.log(dt)
          if (dt.meta.status != 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.getUserList()
          this.editUserDialog = false
          return this.$message.success(dt.meta.msg)
        }
      })
    },
    // 更改用户状态
    async chnageState(user) {
      // console.log(user)
      const { data: dt } = await this.$http.put(
        `/users/${user.id}/state/${user.state}`
      )
      // console.log(dt)
      if (dt.meta.status != 200) {
        this.getUserList()
        return this.$message.error(dt.meta.msg)
      }
      this.$message.success(dt.meta.msg)
    },
    // 修改密码
    async password(id) {
      this.passwordDialog = true
      const { data: dt } = await this.$http.get(`/user/${id}`)
      this.passwordData.id = dt.data.id
      this.passwordData.oldPassword = dt.data.password
    },
    editPassword() {
      this.$refs.passwordRef.validate(async valid => {
        if (valid) {
          var params = new URLSearchParams()
          params.append('newPassword', this.passwordData.newPassword)
          const { data: dt } = await this.$http.put(
            `/editPassword/${this.passwordData.id}`,
            params
          )
          if (dt.meta.status != 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.passwordDialog = false
          return this.$message.success(dt.meta.msg)
        }
      })
    }
  }
}
</script>
<style lang = 'less' scope>
.el-button + .el-button {
  margin-left: 5px;
}
</style>

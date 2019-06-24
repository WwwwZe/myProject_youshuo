<template >
  <div class="managers">
    <com-crumb n1="会员管理" n2="会员列表"></com-crumb>

    <!-- 添加管理员对话框 -->
    <el-dialog
      title="添加管理员"
      :visible.sync="addManagerDialog"
      width="50%"
      @close="$refs.addManagersRef.resetFields()"
    >
      <el-form
        :model="addManagerData"
        :rules="addManagerrules"
        ref="addManagersRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addManagerData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addManagerData.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repassword">
          <el-input v-model="addManagerData.repassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addManagerData.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addManagerData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addManagerDialog = false">取 消</el-button>
        <el-button type="primary" @click="addManagers">添 加</el-button>
      </span>
    </el-dialog>

    <!-- 修改管理员对话框 -->
    <el-dialog
      title="修改管理员信息"
      :visible.sync="editManagerDialog"
      width="50%"
      @close="$refs.editManagerRef.resetFields()"
    >
      <el-form
        :model="editManagerData"
        :rules="editManagerrules"
        ref="editManagerRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editManagerData.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editManagerData.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editManagerData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editManagerDialog = false">取 消</el-button>
        <el-button type="primary" @click="editManager(editManagerData.id)">保 存</el-button>
      </span>
    </el-dialog>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入要搜索用户名相关内容"
            v-model="managerskeywords"
            class="input-with-select search-text"
            clearable
            @clear="searchManagers"
            @keyup.enter.native="searchManagers"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              class="search-btn"
              @click="searchManagers"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="warning" plain @click="addManagerDialog = true">添加管理员</el-button>
        </el-col>
      </el-row>
      <el-table :data="managersList" border style="width: 100%">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="200"></el-table-column>
        <el-table-column label="状态" width="120">
          <template slot-scope="info">
            <el-switch
              v-model="info.row.state"
              active-color="#FFD04B"
              :width="50"
              @change="chnageState(info.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="info">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              plain
              round
              @click="editManagerDialogOpen(info.row.id)"
            >编 辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              plain
              round
              @click="delManagers(info.row.id)"
            >删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="ManagershandleSizeChange"
        @current-change="ManagershandleCurrentChange"
        :current-page="1"
        :page-sizes="[2, 3, 5, 10]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="managersTotal"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getManagerList()
  },
  data() {
    // 检验用户名
    var checkusername = (rule, value, callback) => {
      var reg = /^\w+$/
      if (!reg.test(value)) {
        callback(new Error('请输入数值或字母(包括下划线)'))
      } else {
        callback()
      }
    }
    // 检验俩次密码是否相同
    var checkRePwd = (rule, value, callback) => {
      if (value !== this.addManagerData.password) {
        callback(new Error('两次输入密码不一致'))
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
    var checkMobile = (rule, value, callback) => {
      var reg = /^[1][35678][0-9]{9}$/
      if (!reg.test(value)) {
        callback(new Error('请输入正确电话格式'))
      } else {
        callback()
      }
    }
    return {
      // 搜索关键字
      managerskeywords: '',
      // 管理员列表
      managersList: [],
      // 管理员总条数
      managersTotal: 0,
      // 获取管理员所需参数
      managerListParams: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 添加管理员对话框控制
      addManagerDialog: false,
      // 添加管理员信息
      addManagerData: {
        username: '',
        password: '',
        repassword: '',
        email: '',
        mobile: ''
      },
      // 添加管理员表单检验
      addManagerrules: {
        username: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          },
          { validator: checkusername, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        repassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: checkRePwd, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },

      // 编辑管理员对话框控制
      editManagerDialog: false,
      // 编辑管理员信息
      editManagerData: {},
      // 编辑管理员表单检验
      editManagerrules: {
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
    // 获取管理员列表
    async getManagerList() {
      const { data: dt } = await this.$http.get('/getManager', {
        params: this.managerListParams
      })
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.managersList = dt.data.managers
      this.managersTotal = dt.data.pagetotal
      if (this.managersList.length == 0) {
        this.managerListParams.pagenum = Math.ceil(
          this.managersTotal / this.managerListParams.pagesize
        )
        if (this.managerListParams.pagenum == 0) {
          this.managerListParams.pagenum = 1
        }
        return this.getManagerList()
      }
    },
    //   更改每页显示条数
    ManagershandleSizeChange(val) {
      // console.log(val)
      this.managerListParams.pagesize = val
      this.getManagerList()
    },
    //   更改页数
    ManagershandleCurrentChange(val) {
      // console.log(val)
      this.managerListParams.pagenum = val
      this.getManagerList()
    },
    // 搜索管理员
    searchManagers() {
      this.managerListParams.query = this.managerskeywords
      this.getManagerList()
    },
    // 添加管理员
    addManagers() {
      // console.log(this.addManagerData)
      this.$refs.addManagersRef.validate(async valid => {
        if (valid) {
          var params = new URLSearchParams()
          params.append('username', this.addManagerData.username)
          params.append('password', this.addManagerData.password)
          params.append('email', this.addManagerData.email)
          params.append('mobile', this.addManagerData.mobile)
          const { data: dt } = await this.$http.post('/addManager', params)
          // console.log(dt)
          if (dt.meta.status != 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.addManagerDialog = false
          this.getManagerList()
        }
      })
    },
    // 删除管理员
    delManagers(id) {
      // console.log(id)
      this.$confirm('您确定删除该管理员吗?', '删除', {
        confirmButtonText: '是的',
        cancelButtonText: '再想想...',
        type: 'info'
      })
        .then(async () => {
          const { data: dt } = await this.$http.delete(`/delManager/${id}`)
          // console.log(dt)
          if (dt.meta.status != 200) return this.$message.error(dt.meta.msg)
          // // 小bug：最后一页只剩一条删除 删除后数据为空 this.managerListParams.pagenum没改变
          // if (this.managersList.length === 1) {
          //   this.managerListParams.pagenum--
          // }
          this.getManagerList()
          this.$message.success(dt.meta.msg)
        })
        .catch(() => {})
    },
    // 打开编辑管理员窗口个
    async editManagerDialogOpen(id) {
      this.editManagerDialog = true
      const { data: dt } = await this.$http.get(`/manager/${id}`)
      // console.log(dt)
      this.editManagerData = dt.data
    },
    // 编辑管理员
    editManager() {
      this.$refs.editManagerRef.validate(async valid => {
        if (valid) {
          var params = new URLSearchParams()
          params.append('username', this.editManagerData.username)
          params.append('email', this.editManagerData.email)
          params.append('mobile', this.editManagerData.mobile)
          const { data: dt } = await this.$http.put(
            `/editManager/${this.editManagerData.id}`,
            params
          )
          // console.log(dt)
          if (dt.meta.status != 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.getManagerList()
          this.editManagerDialog = false
          return this.$message.success(dt.meta.msg)
        }
      })
    },
    // 更改管理员状态
    async chnageState(manager) {
      // console.log(manager)
      const { data: dt } = await this.$http.put(
        `/managers/${manager.id}/state/${manager.state}`
      )
      // console.log(dt)
      if (dt.meta.status != 200) {
        this.getManagerList()
        return this.$message.error(dt.meta.msg)
      }
      this.$message.success(dt.meta.msg)
    }
  }
}
</script>
<style lang = 'less' scope>
</style>

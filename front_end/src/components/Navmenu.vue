<template >
  <div>
    <com-crumb n1="设置" n2="导航菜单"></com-crumb>

    <!-- 添加菜单弹框 -->
    <el-dialog
      title="添加菜单"
      :visible.sync="addNavmenuDialog"
      width="50%"
      @close="$refs.addNavmenuRef.resetFields()"
    >
      <el-form
        :model="addNavmenuData"
        :rules="addNavmenuRules"
        ref="addNavmenuRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="addNavmenuData.name"></el-input>
        </el-form-item>
        <el-form-item label="路由路径" prop="path">
          <el-input v-model="addNavmenuData.path"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="addNavmenuData.icon"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addNavmenuDialog = false">取 消</el-button>
        <el-button type="primary" @click="addNavmenu">添 加</el-button>
      </span>
    </el-dialog>

    <!-- 编辑菜单弹框 -->
    <el-dialog
      title="编辑菜单"
      :visible.sync="editNavmenuDialog"
      width="50%"
      @close="$refs.editNavmenuRef.resetFields()"
    >
      <el-form
        :model="editNavmenuData"
        :rules="editNavmenuRules"
        ref="editNavmenuRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="editNavmenuData.name"></el-input>
        </el-form-item>
        <el-form-item label="路由路径" prop="path">
          <el-input v-model="editNavmenuData.path"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="editNavmenuData.icon"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editNavmenuDialog = false">取 消</el-button>
        <el-button type="primary" @click="editNavmenu">修 改</el-button>
      </span>
    </el-dialog>

    <el-card class="box-card">
      <el-row>
        <el-col :span="8">
          <el-button type="warning" plain @click="addNavmenuDialog = true">添加菜单</el-button>
        </el-col>
      </el-row>
      <el-table :data="navmenuList" style="width: 100%">
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column prop="name" label="菜单名称"></el-table-column>
        <el-table-column prop="path" label="路由路径"></el-table-column>
        <el-table-column label="图标">
          <template slot-scope="info">
            <span :class="['iconfont',info.row.icon]"></span>
            {{info.row.icon}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="info">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              plain
              round
              @click="editNavmenuD(info.row.id)"
            >编 辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              plain
              round
              @click="delNavmenu(info.row.id)"
            >删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getNavmenu()
  },
  data() {
    return {
      navmenuList: [],
      //   添加数据
      addNavmenuData: {
        name: '',
        path: '',
        icon: ''
      },
      addNavmenuRules: {},
      addNavmenuDialog: false,
      //   编辑数据
      editNavmenuDialog: false,
      editNavmenuData: {},
      editNavmenuRules: {}
    }
  },
  methods: {
    //   获取
    async getNavmenu() {
      const { data: dt } = await this.$http.get('/navmenu')
      this.navmenuList = dt.data
    },
    // 添加
    async addNavmenu() {
      const params = new URLSearchParams()
      params.append('name', this.addNavmenuData.name)
      params.append('path', this.addNavmenuData.path)
      params.append('icon', this.addNavmenuData.icon)
      const { data: dt } = await this.$http.post('/addNavmenu', params)
      if (dt.meta.status != 200) return this.$message.error(dt.meta.msg)
      this.$message.success(dt.meta.msg)
      this.getNavmenu()
      this.addNavmenuDialog = false
    },
    // 删除
    delNavmenu(id) {
      this.$confirm('您确定删除该菜单项吗?', '删除', {
        confirmButtonText: '是的',
        cancelButtonText: '再想想...',
        type: 'info'
      })
        .then(async () => {
          const { data: dt } = await this.$http.delete('/delNavmenu/' + id)
          if (dt.meta.status != 200) return this.$message.error(dt.meta.msg)
          this.$message.success(dt.meta.msg)
          this.getNavmenu()
        })
        .catch(() => {})
    },
    // 打开编辑窗口
    async editNavmenuD(id) {
      const { data: dt } = await this.$http.get('/getNanmenu/' + id)
      if (dt.meta.status != 200) return this.$message.error(dt.meta.msg)
      this.editNavmenuData = dt.data
      this.editNavmenuDialog = true
    },
    // 修改
    async editNavmenu() {
      const params = new URLSearchParams()
      params.append('name', this.editNavmenuData.name)
      params.append('icon', this.editNavmenuData.icon)
      params.append('path', this.editNavmenuData.path)
      const { data: dt } = await this.$http.put(
        '/editNavmenu/' + this.editNavmenuData.id,
        params
      )
      if (dt.meta.status != 200) return this.$message.error(dt.meta.msg)
      this.$message.success(dt.meta.msg)
      this.editNavmenuDialog = false
      this.getNavmenu()
    }
  }
}
</script>
<style lang = 'less'>
</style>

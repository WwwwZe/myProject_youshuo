<template >
  <div>
    <com-crumb n1="文章管理" n2="文章类型"></com-crumb>

    <!-- 添加分类类型对话框 -->
    <el-dialog
      title="添加分类类型"
      :visible.sync="addTypeDialog"
      width="50%"
      @close="$refs.addTypeRef.resetFields()"
    >
      <el-form
        :model="addTypeData"
        :rules="addTyperules"
        ref="addTypeRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类分类" prop="type">
          <el-radio-group v-model="addTypeData.type">
            <el-radio label="type1">地区分类</el-radio>
            <el-radio label="type2">攻略分类</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="addTypeData.name"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon" v-if="addTypeData.type=='type2'">
          <el-input v-model="addTypeData.icon"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTypeDialog = false">取 消</el-button>
        <el-button type="primary" @click="addType">添 加</el-button>
      </span>
    </el-dialog>

    <!-- 编辑类型对话框 -->
    <el-dialog
      :title="editTypeData.icon?'编辑攻略分类类型':'编辑地区分类类型'"
      :visible.sync="editTypeDialog"
      width="50%"
      @close="$refs.editTypeRef.resetFields()"
    >
      <el-form
        :model="editTypeData"
        :rules="editTyperules"
        ref="editTypeRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="editTypeData.name"></el-input>
        </el-form-item>
        <el-form-item label="类型图标" prop="icon" v-if="editTypeData.icon">
          <el-input v-model="editTypeData.icon"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editTypeDialog = false">取 消</el-button>
        <el-button type="primary" @click="editType">修 改</el-button>
      </span>
    </el-dialog>

    <el-card class="box-card">
      <el-row>
        <el-col :span="8">
          <el-button type="warning" plain @click="addTypeDialog = true">添加类型</el-button>
        </el-col>
      </el-row>
      <el-tabs v-model="typesTabsActiveName" @tab-click="handleClick">
        <el-tab-pane label="地区分类" name="type1">
          <el-table :data="type1List" style="width: 80%">
            <el-table-column type="index" label="序号" width="100"></el-table-column>
            <el-table-column prop="name" label="类型名称"></el-table-column>
            <el-table-column prop="addtime" label="创建时间"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="info">
                <el-button
                  type="warning"
                  icon="el-icon-edit"
                  size="mini"
                  plain
                  round
                  @click="editTypeD(info.row)"
                >编 辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  plain
                  round
                  @click="delType1(info.row.id)"
                >删 除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="攻略分类" name="type2">
          <el-table :data="type2List" style="width: 80%">
            <el-table-column type="index" label="序号" width="100"></el-table-column>
            <el-table-column prop="name" label="类型名称"></el-table-column>
            <el-table-column prop="icon" label="类型图标" width="200">
              <template slot-scope="info">
                <i :class="['iconfont', info.row.icon]" :style="{fontSize:'25px'}"></i>
                {{info.row.icon}}
              </template>
            </el-table-column>
            <el-table-column prop="addtime" label="创建时间"></el-table-column>
            <el-table-column prop="address" label="操作" width="200">
              <template slot-scope="info">
                <el-button
                  type="warning"
                  icon="el-icon-edit"
                  size="mini"
                  plain
                  round
                  @click="editTypeD(info.row)"
                >编 辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  plain
                  round
                  @click="delType2(info.row.id)"
                >删 除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getType1()
    this.getType2()
  },
  data() {
    return {
      // 标签页初始页
      typesTabsActiveName: 'type1',
      // 地区类型数据
      type1List: [],
      // 攻略类型数据
      type2List: [],
      // 添加类型数据
      addTypeData: {
        name: '',
        type: '',
        icon: ''
      },
      //   添加类型数据规则
      addTyperules: {
        type: [{ required: true, message: '请选择分类类型', trigger: 'blur' }],
        name: [{ required: true, message: '请填写类型名', trigger: 'blur' }],
        icon: [{ required: true, message: '请填写类型图标', trigger: 'blur' }]
      },
      // 控制添加类型对话框
      addTypeDialog: false,
      // 控制编辑类型对话框
      editTypeDialog: false,
      // 编辑类型数据
      editTypeData: {},
      //   编辑类型数据规则
      editTyperules: {
        name: [{ required: true, message: '请填写类型名', trigger: 'blur' }],
        icon: [{ required: true, message: '请填写类型图标', trigger: 'blur' }]
      }
    }
  },
  methods: {
    //   表切页切换
      handleClick(){
          this.getType1()
          this.getType2()
      },
    // 获取地区类型数据
    async getType1() {
      const { data: dt } = await this.$http.get('/getType1')
      //   console.log(dt)
      this.type1List = dt.data
    },
    // 获取攻略类型数据
    async getType2() {
      const { data: dt } = await this.$http.get('/getType2')
      //   console.log(dt)
      this.type2List = dt.data
    },
    // 删除地区类型数据
    async delType1(id) {
      const { data: dt } = await this.$http.delete(`/delType1/${id}`)
      // console.log(dt)
      if (dt.meta.status != 200) return this.$message.error(dt.meta.msg)
      this.$message.success(dt.meta.msg)
      this.getType1()
    },
    // 删除攻略类型数据
    async delType2(id) {
      const { data: dt } = await this.$http.delete(`/delType2/${id}`)
      // console.log(dt)
      if (dt.meta.status != 200) return this.$message.error(dt.meta.msg)
      this.$message.success(dt.meta.msg)
      this.getType2()
    },
    // 添加类型
    addType() {
      this.$refs.addTypeRef.validate(async valid => {
        if (valid) {
          var params = new URLSearchParams()
          params.append('name', this.addTypeData.name)
          var addTypeUrl =
            this.addTypeData.type == 'type1' ? '/addType1' : '/addType2'
          if (this.addTypeData.type == 'type2') {
            params.append('icon', this.addTypeData.icon)
          }
          const { data: dt } = await this.$http.post(addTypeUrl, params)
          if (dt.meta.status != 200) return this.$message.error(dt.meta.msg)
          this.$message.success(dt.meta.msg)
          this.addTypeDialog = false
          this.addTypeData.type == 'type1' ? this.getType1() : this.getType2()
        }
      })
    },
    // 打开编辑对话框
    async editTypeD(info) {
      this.editTypeDialog = true
      var url = info.icon ? 'type2' : 'type1'
      const { data: dt } = await this.$http.get(`/${url}/${info.id}`)
      this.editTypeData = dt.data
    },
    // 编辑类型
    async editType() {
      var editTypeUrl = this.editTypeData.icon ? 'editType2' : 'editType1'
      console.log(this.editTypeData.icon)
      var params = new URLSearchParams()
      params.append('name', this.editTypeData.name)
      if (this.editTypeData.icon) {
        params.append('icon', this.editTypeData.icon)
      }
      const { data: dt } = await this.$http.put(
        `/${editTypeUrl}/${this.editTypeData.id}`,
        params
      )
      if (dt.meta.status != 200) return this.$message.error(dt.meta.msg)
      this.editTypeDialog = false
      this.$message.success(dt.meta.msg)
      this.editTypeData.icon ? this.getType2() : this.getType1()
    }
  }
}
</script>
<style lang = 'less'>
</style>

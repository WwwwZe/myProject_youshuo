<template >
  <div>
    <com-crumb n1="设置" n2="网站设置"></com-crumb>

    <el-card class="box-card">
      <el-row>
        <el-col :span="16" :offset="3">
          <el-form
            :model="settingData"
            :rules="settingRules"
            ref="settingForm"
            class="demo-ruleForm"
          >
            <el-button type="warning" @click="isSetting = false" v-if="isSetting">修 改</el-button>
            <el-button type="primary" @click="editSetting" v-if="!isSetting">保 存</el-button>
            <el-button type="info" @click="getSettingData" v-if="!isSetting">重 置</el-button>
            <el-form-item label="站点名称" prop="title">
              <el-input v-model="settingData.title" :disabled="isSetting"></el-input>
            </el-form-item>
            <el-form-item label="站点描述" prop="description">
              <el-input
                type="textarea"
                v-model="settingData.description"
                :autosize="{ minRows: 3, maxRows: 6 }"
                resize="none"
                :disabled="isSetting"
              ></el-input>
            </el-form-item>
            <el-form-item label="站点关键词" prop="newKeyWords">
              <el-input v-model="settingData.newKeyWords" @keyup.enter.native="addKeyWords">
                <el-tooltip
                  slot="append"
                  class="item"
                  effect="dark"
                  content="添加新关键词"
                  placement="top-start"
                >
                  <el-button icon="el-icon-plus" @click="addKeyWords"></el-button>
                </el-tooltip>
              </el-input>
            </el-form-item>
            <el-form-item class="keywords">
              <el-tag
                type="warning"
                v-for="(v,k) in settingData.keywords"
                :key="k"
                closable
                :disable-transitions="false"
                @close="delKeyWords(v)"
              >{{v}}</el-tag>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getSettingData()
  },
  data() {
    return {
      // 站点信息
      settingData: {
        id: 1,
        title: '',
        description: '',
        keywords: [],
        newKeyWords: ''
      },
      settingRules: {},
      isSetting: true
    }
  },
  methods: {
    // 获取设置信息
    async getSettingData() {
      const { data: dt } = await this.$http.get('/getSetting')
      // console.log(dt)
      this.settingData.id = dt.data.id
      this.settingData.title = dt.data.title
      this.settingData.description = dt.data.description
      this.settingData.keywords = dt.data.keywords
    },
    // 编辑设置信息
    async editSetting() {
      this.isSetting = true
      var params = new URLSearchParams()
      params.append('title', this.settingData.title)
      params.append('description', this.settingData.description)
      const { data: dt } = await this.$http.put(
        '/editSetting/' + this.settingData.id,
        params
      )
      // console.log(dt)
      if (dt.meta.status != 200) return this.$message.error(dt.meta.msg)
      this.$message.success(dt.meta.msg)
    },
    // 删除关键词
    async delKeyWords(tag) {
      // console.log(tag)
      this.$confirm('您确定删除该关键词吗?', '删除', {
        confirmButtonText: '是的',
        cancelButtonText: '再想想...',
        type: 'info'
      })
        .then(async () => {
          var index = this.settingData.keywords.indexOf(tag)
          this.settingData.keywords.splice(index, 1)
          var params = new URLSearchParams()
          params.append('keywords', this.settingData.keywords)
          const { data: dt } = await this.$http.put(
            '/keyWords/' + this.settingData.id,
            params
          )
          if (dt.meta.status != 200) {
            this.$message.error(dt.meta.msg)
            return this.getSettingData()
          }
          this.$message.success(dt.meta.msg)
        })
        .catch(() => {})
    },
    // 添加关键词
    async addKeyWords() {
      if (this.settingData.newKeyWords.trim() == '')
        return this.$message.error('请输入新关键词')
      this.settingData.keywords.push(this.settingData.newKeyWords.trim())
      this.settingData.newKeyWords = ''
      var params = new URLSearchParams()
      params.append('keywords', this.settingData.keywords)
      const { data: dt } = await this.$http.put(
        '/keyWords/' + this.settingData.id,
        params
      )
      if (dt.meta.status != 200) {
        this.$message.error(dt.meta.msg)
        return this.getSettingData()
      }
      this.$message.success(dt.meta.msg)
    }
  }
}
</script>
<style lang = 'less'>
.el-form-item__label {
  color: #eee;
}
.el-form-item.is-required:not(.is-no-asterisk)
  .el-form-item__label-wrap
  > .el-form-item__label:before,
.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  content: '';
}
.keywords {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 5px;
}
.el-tag {
  margin: 10px;
}
</style>

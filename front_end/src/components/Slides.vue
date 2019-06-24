<template >
  <div>
    <com-crumb n1="设置" n2="图片轮播"></com-crumb>

    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑轮播图"
      :visible.sync="editSlideDialog"
      width="50%"
      @close="$refs.editSlideRef.resetFields()"
    >
      <el-form
        :model="editSlideData"
        :rules="editSliderules"
        ref="editSlideRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="文本" prop="text">
          <el-input v-model="editSlideData.text"></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="link">
          <el-input v-model="editSlideData.link"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSlideDialog = false">取 消</el-button>
        <el-button type="primary" @click="editSlide(editSlideData.id)">修 改</el-button>
      </span>
    </el-dialog>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <div style="font-size:22px;margin-bottom:20px">添加新轮播内容</div>
          <el-form
            :model="addSlideData"
            :rules="addSliderules"
            ref="addSlideRef"
            :class="['demo-ruleForm','myForm']"
          >
            <div class="imgbox" v-if="imgurl!==''">
              <img :src="imgurl" width="300px" height="200px">
            </div>
            <el-form-item prop="file" class="file">
              <div class="filebox">
                <input type="file" @change="uploadimg" ref="fileRef" id="inputfile">
              </div>
              <el-input type="hidden" v-model="addSlideData.file"></el-input>
            </el-form-item>
            <el-form-item label="文本" prop="text">
              <el-input type="textarea" v-model="addSlideData.text" rows="3" resize="none"></el-input>
            </el-form-item>
            <el-form-item label="链接" prop="link">
              <el-input v-model="addSlideData.link"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="warning" @click="addSlide">添 加</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="16">
          <el-table :data="slideList" border style="width: 100%">
            <el-table-column label="图片" width="220">
              <template slot-scope="info">
                <img :src="'http://127.0.0.1:484'+info.row.url" width="200" height="100" alt>
              </template>
            </el-table-column>
            <el-table-column prop="text" label="文本"></el-table-column>
            <el-table-column prop="link" label="链接" width="100"></el-table-column>
            <el-table-column label="操作" width="125">
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
                    @click="editSlideD(info.row.id)"
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
                    @click="delSlide(info.row.id)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getSlideList()
  },
  data() {
    // 检验链接格式
    var checkLink = (rule, value, callback) => {
      var reg = /^(\/\w*)+$/
      if (!reg.test(value)) {
        callback(new Error('请输入链接正确格式(/.../......)'))
      } else {
        callback()
      }
    }
    return {
      // 添加新轮播数据
      addSlideData: {
        text: '',
        file: '',
        link: ''
      },
      // 添加新轮播表单验证
      addSliderules: {
        file: [{ required: true, message: '请选择图片', trigger: 'blur' }],
        text: [{ required: true, message: '请填写文本', trigger: 'blur' }],
        link: [
          { required: true, message: '请填写链接', trigger: 'blur' },
          { validator: checkLink, trigger: 'blur' }
        ]
      },
      //   图片路径
      imgurl: '',
      //   轮播图列表
      slideList: [],
      //  控制编辑轮播图窗口
      editSlideDialog: false,
      editSlideData: {
        text: '',
        link: ''
      },
      editSliderules: {
        text: [{ required: true, message: '请填写文本', trigger: 'blur' }],
        link: [
          { required: true, message: '请填写链接', trigger: 'blur' },
          { validator: checkLink, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //   图片上传
    async uploadimg() {
      if (this.$refs.fileRef.files.length == 0) {
        this.imgurl = ''
        return (this.addSlideData.file = '')
      }

      var fileObj = this.$refs.fileRef.files[0]
      var fd = new FormData()
      fd.append('pic', fileObj)
      const { data: dt } = await this.$http.post('/upload', fd)
      //   console.log(dt)
      this.addSlideData.file = dt.data.path
      this.imgurl = 'http://127.0.0.1:484' + dt.data.path
    },
    // 添加轮播图
    addSlide() {
      this.$refs.addSlideRef.validate(async valid => {
        if (valid) {
          //   console.log(this.addSlideData)
          var params = new URLSearchParams()
          params.append('url', this.addSlideData.file)
          params.append('text', this.addSlideData.text)
          params.append('link', this.addSlideData.link)
          const { data: dt } = await this.$http.post('/addSlide', params)
          //   console.log(dt)
          if (dt.meta.status != 200) return this.$message.error(dt.meta.msg)
          this.$message.success(dt.meta.msg)
          this.getSlideList()
          this.imgurl = ''
          this.$refs.addSlideRef.resetFields()
          document.getElementsByClassName('myForm')[0].reset()
        } else {
          return false
        }
      })
    },
    // 获取轮播图列表
    async getSlideList() {
      const { data: dt } = await this.$http.get('/getSlide')
      //   console.log(dt)
      this.slideList = dt.data
    },
    // 删除轮播图
    async delSlide(id) {
      //   console.log(id)
      this.$confirm('您确定删除该轮播图吗?', '删除', {
        confirmButtonText: '是的',
        cancelButtonText: '再想想...',
        type: 'info'
      })
        .then(async () => {
          const { data: dt } = await this.$http.delete('/delSlide/' + id)
          // console.log(dt)
          if (dt.meta.status != 200) return this.$message.error(dt.meta.msg)
          this.$message.success(dt.meta.msg)
          this.getSlideList()
        })
        .catch(() => {})
    },
    // 打开编辑窗口
    async editSlideD(id) {
      this.editSlideDialog = true
      const { data: dt } = await this.$http.get('/slide/' + id)
      if (dt.meta.status != 200) return this.$message.error(dt.meta.msg)
      this.editSlideData = dt.data
    },
    // 编辑轮播图
    async editSlide(id) {
      var params = new URLSearchParams()
      params.append('text', this.editSlideData.text)
      params.append('link', this.editSlideData.link)
      const { data: dt } = await this.$http.put('/editslide/' + id, params)
      if (dt.meta.status != 200) return this.$message.error(dt.meta.msg)
      this.$message.success(dt.meta.msg)
      this.editSlideDialog = false
      this.getSlideList()
    }
  }
}
</script>
<style lang = 'less'>
.el-form-item__label {
  color: #eee;
}
.el-dialog {
  .el-form-item__label {
    color: #555;
  }
  .el-form-item.is-required:not(.is-no-asterisk)
    .el-form-item__label-wrap
    > .el-form-item__label:before,
  .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
    content: '*';
  }
}
.file {
  height: 30px;
  .filebox {
    color: #555;
    background-color: #fff;
    padding-left: 30px;
    border-radius: 5px;
  }
  .el-form-item__error {
    top: 40px;
  }
}
.el-form-item.is-required:not(.is-no-asterisk)
  .el-form-item__label-wrap
  > .el-form-item__label:before,
.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  content: '';
}
</style>

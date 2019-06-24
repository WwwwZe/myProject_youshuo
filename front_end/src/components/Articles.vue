<template >
  <div class="articles">
    <com-crumb n1="文章管理" n2="文章列表"></com-crumb>

    <!-- 修改文章对话框 -->
    <el-dialog
      title="修改文章信息"
      :visible.sync="editArticleDialog"
      width="50%"
      @close="$refs.editArticlesRef.resetFields()"
    >
      <el-form
        :model="editArticleData"
        :rules="editArticlerules"
        ref="editArticlesRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="editArticleData.title"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input
            type="textarea"
            v-model="editArticleData.desc"
            :autosize="{ minRows: 2, maxRows: 6 }"
            resize="none"
          ></el-input>
        </el-form-item>
        <el-form-item label="攻略分类">
          <el-checkbox-group v-model="editArticleData.type2">
            <el-checkbox
              :label="v.id+''"
              :name="v.type2"
              v-for="v in type2List"
              :key="v.id"
            >{{ v.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="地区分类">
          <el-radio-group v-model="editArticleData.type1">
            <el-radio :label="v.id" v-for="v in type1List" :key="v.id">{{ v.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editArticleDialog = false">取 消</el-button>
        <el-button type="primary" @click="editArticles(editArticleData.id)">保 存</el-button>
      </span>
    </el-dialog>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索文章标题相关内容"
            v-model="articleskeywords"
            class="input-with-select search-text"
            clearable
            @clear="searchArticles"
            @keyup.enter.native="searchArticles"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              class="search-btn"
              @click="searchArticles"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data=" articlesList" border style="width: 100%">
        <el-table-column type="expand" width="50">
          <template slot-scope="info">
            <el-row>
              <el-col :span="4">地区分类:</el-col>
              <el-col :span="20">
                <el-tag
                  :type="info.row.type1==v.id?'warning':'info'"
                  v-for="v in type1List"
                  :key="v.id"
                >{{ v.name }}</el-tag>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">攻略分类:</el-col>
              <el-col :span="20">
                <el-tag
                  :type="info.row.type2[0] == v.id || info.row.type2[1] ==v.id || info.row.type2[2] ==v.id || info.row.type2[3] ==v.id || info.row.type2[4] ==v.id?'warning':'info'"
                  v-for="v in type2List"
                  :key="v.id"
                >{{ v.name }}</el-tag>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="author" label="作者" width="120"></el-table-column>
        <el-table-column prop="addtime" label="创建时间" width="150"></el-table-column>
        <el-table-column label="发布状态" width="160">
          <template slot-scope="info">
            <el-switch
              v-model="info.row.state"
              active-color="#FFD04B"
              active-text="已发布"
              inactive-text="草稿"
              @change="changeState(info.row)"
            >></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="焦点状态" width="80">
          <template slot-scope="info">
            <el-switch
              v-model="info.row.focus"
              active-color="#FFD04B"
              @change="changeFocus(info.row)"
            >></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="info">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              plain
              round
              @click="editArticleDialogOpen(info.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              plain
              round
              @click="delArticles(info.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="ArticleshandleSizeChange"
        @current-change="ArticleshandleCurrentChange"
        :current-page="1"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="articlesTotal"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getArticleList()
    this.getType1()
    this.getType2()
  },
  data() {
    return {
      // 搜索关键字
      articleskeywords: '',
      // 文章列表
      articlesList: [],
      // 文章总条数
      articlesTotal: 0,
      // 获取文章所需参数
      articleListParams: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 编辑文章对话框控制
      editArticleDialog: false,
      // 编辑文章信息
      editArticleData: {},
      // 编辑文章表单检验
      editArticlerules: {
        title: [{ required: true, message: '标题必填', trigger: 'blur' }]
      },
      // 地区类型数据
      type1List: [],
      // 攻略类型数据
      type2List: []
    }
  },
  methods: {
    // 获取文章列表
    async getArticleList() {
      const { data: dt } = await this.$http.get('/getArticle', {
        params: this.articleListParams
      })
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.articlesList = dt.data.articles
      this.articlesTotal = dt.data.pagetotal
      if (this.articlesList.length == 0) {
        this.articleListParams.pagenum = Math.ceil(
          this.articlesTotal / this.articleListParams.pagesize
        )
        if (this.articleListParams.pagenum == 0) {
          this.articleListParams.pagenum = 1
        }
        return this.getArticleList()
      }
    },
    //   更改每页显示条数
    ArticleshandleSizeChange(val) {
      // console.log(val)
      this.articleListParams.pagesize = val
      this.getArticleList()
    },
    //   更改页数
    ArticleshandleCurrentChange(val) {
      // console.log(val)
      this.articleListParams.pagenum = val
      this.getArticleList()
    },
    // 搜索文章
    searchArticles() {
      this.articleListParams.query = this.articleskeywords
      this.getArticleList()
    },
    // 删除文章
    delArticles(id) {
      // console.log(id)
      this.$confirm('您确定删除该文章吗?', '删除', {
        confirmButtonText: '是的',
        cancelButtonText: '再想想...',
        type: 'info'
      })
        .then(async () => {
          const { data: dt } = await this.$http.delete(`/delArticle/${id}`)
          // console.log(dt)
          if (dt.meta.status != 200) return this.$message.error(dt.meta.msg)
          // // 小bug：最后一页只剩一条删除 删除后数据为空 this.articleListParams.pagenum没改变
          // if (this.articlesList.length === 1) {
          //   this.articleListParams.pagenum--
          // }
          this.getArticleList()
          this.$message.success(dt.meta.msg)
        })
        .catch(() => {})
    },

    // 打开编辑文章窗口个
    async editArticleDialogOpen(id) {
      this.editArticleDialog = true
      const { data: dt } = await this.$http.get(`/article/${id}`)
      // console.log(dt)
      this.editArticleData = dt.data
    },
    // 编辑文章
    editArticles() {
      this.$refs.editArticlesRef.validate(async valid => {
        if (valid) {
          // console.log(this.editArticleData)
          var params = new URLSearchParams()
          params.append('title', this.editArticleData.title)
          params.append('desc', this.editArticleData.desc)
          params.append('type1', this.editArticleData.type1)
          params.append('type2', this.editArticleData.type2)
          const { data: dt } = await this.$http.put(
            `/editArticle/${this.editArticleData.id}`,
            params
          )
          // console.log(dt)
          if (dt.meta.status != 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.getArticleList()
          this.editArticleDialog = false
          return this.$message.success(dt.meta.msg)
        }
      })
    },
    // 更改文章状态
    async changeState(article) {
      const { data: dt } = await this.$http.put(
        `/articles/${article.id}/state/${article.state}`
      )
      // console.log(dt)
      if (dt.meta.status != 200) {
        this.getArticleList()
        return this.$message.error(dt.meta.msg)
      }
      this.$message.success(dt.meta.msg)
    },
    // 更改文章焦点状态
    async changeFocus(article) {
      // console.log(manager)
      const { data: dt } = await this.$http.put(
        `/articles/${article.id}/focus/${article.focus}`
      )
      // console.log(dt)
      if (dt.meta.status != 200) {
        this.getArticleList()
        return this.$message.error(dt.meta.msg)
      }
      this.$message.success(dt.meta.msg)
    },
    // 获取地区类型数据
    async getType1() {
      const { data: dt } = await this.$http.get('/getType1')
      // console.log(dt)
      this.type1List = dt.data
    },
    // 获取攻略类型数据
    async getType2() {
      const { data: dt } = await this.$http.get('/getType2')
      // console.log(dt)
      this.type2List = dt.data
    },
  }
}
</script>
<style lang = 'less' scope>
.el-table__expanded-cell {
  .el-row {
    margin: 20px 0;
    border-bottom: 1px dashed #fff;
    .el-tag {
      margin: 10px;
    }
  }
}
</style>

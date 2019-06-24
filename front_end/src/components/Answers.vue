<template >
  <div>
    <com-crumb n1="问答管理" n2="回答列表"></com-crumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入要搜索评论内容相关内容"
            v-model="answerskeywords"
            class="input-with-selectsearchAnswers search-text"
            clearable
            @clear="searchAnswers"
            @keyup.enter.native="searchAnswers"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              class="search-btn"
              @click="searchAnswers"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="answersData" border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="content" label="评论"></el-table-column>
        <el-table-column prop="author" label="评论者" width="100"></el-table-column>
        <el-table-column prop="ask" label="评论在"></el-table-column>
        <el-table-column label="状态" width="70">
          <template slot-scope="info">
            <el-switch
              v-model="info.row.state"
              active-color="#FFD04B"
              @change="chnageState(info.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="操作" width="100">
          <template slot-scope="info">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              plain
              round
              @click="delAnswer(info.row.id)"
            >删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        ref="page"
        @size-change="answersHandleSizeChange"
        @current-change="answersHandleCurrentChange"
        :current-page="1"
        :page-sizes="[ 5, 10, 15, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="answewrTotal"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getAnswers()
  },
  data() {
    return {
      answerParams: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      answerskeywords: '',
      answersData: [],
      answewrTotal: 0
    }
  },
  methods: {
    // 获取
    async getAnswers() {
      const { data: dt } = await this.$http.get('/answers', {
        params: this.answerParams
      })
      //   console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.answewrTotal = dt.data.pagetotal
      this.answersData = dt.data.answers
      if (this.answersData.length == 0) {
        this.answerParams.pagenum = Math.ceil(
          this.answewrTotal / this.answerParams.pagesize
        )
        if (this.answerParams.pagenum == 0) {
          this.answerParams.pagenum = 1
        }
        this.getAnswers()
      }
    },
    answersHandleSizeChange(val) {
      this.answerParams.pagesize = val
      this.getAnswers()
    },
    answersHandleCurrentChange(val) {
      this.answerParams.pagenum = val
      this.getAnswers()
    },
    // 搜索
    searchAnswers() {
      this.answerParams.query = this.answerskeywords
      this.getAnswers()
    },
    // 删除
    delAnswer(id) {
      this.$confirm('您确定删除该回答吗?', '删除', {
        confirmButtonText: '是的',
        cancelButtonText: '再想想...',
        type: 'info'
      })
        .then(async () => {
          const { data: dt } = await this.$http.delete('/delAnswer/' + id)
          if (dt.meta.status != 200) return this.$message.error(dt.meta.msg)
          this.$message.success(dt.meta.msg)
          this.getAnswers()
        })
        .catch(() => {})
    },
    // 更改状态
    async chnageState(info) {
      const { data: dt } = await this.$http.put(
        `/answers/${info.id}/state/${info.state}`
      )
      if (dt.meta.status != 200) {
        this.getAnswers()
        return this.$message.error(dt.meta.msg)
      }
      this.$message.success(dt.meta.msg)
    }
  }
}
</script>
<style lang = 'less'>
</style>

<template >
  <div>
    <com-crumb n1="问答管理" n2="问题列表"></com-crumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入要搜索标题相关内容"
            v-model="questionskeywords"
            class="input-with-select search-text"
            clearable
            @clear="searchQuestions"
            @keyup.enter.native="searchQuestions"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              class="search-btn"
              @click="searchQuestions"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="questionsData" border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="author" label="作者" width="150"></el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="info">
            <el-switch
              v-model="info.row.state"
              active-color="#FFD04B"
              @change="chnageState(info.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="操作" width="150">
          <template slot-scope="info">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              plain
              round
              @click="delQuestion(info.row.id)"
            >删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        ref="page"
        @size-change="questionsHandleSizeChange"
        @current-change="questionsHandleCurrentChange"
        :current-page="1"
        :page-sizes="[ 3, 5, 8, 10]"
        :page-size="3"
        layout="total, sizes, prev, pager, next, jumper"
        :total="questionsTotal"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getQuestions()
  },
  data() {
    return {
      questionskeywords: '',
      questionsParams: {
        query: '',
        pagenum: 1,
        pagesize: 3
      },
      questionsData: [],
      questionsTotal: 0
    }
  },
  methods: {
    //   获取
    async getQuestions() {
      const { data: dt } = await this.$http.get('/questions', {
        params: this.questionsParams
      })
      //console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.questionsTotal = dt.data.pagetotal
      this.questionsData = dt.data.questions
      if (this.questionsData.length == 0) {
        this.questionsParams.pagenum = Math.ceil(
          this.questionsTotal / this.questionsParams.pagesize
        )
        if (this.questionsParams.pagenum == 0) {
          this.questionsParams.pagenum = 1
        }
        return this.getQuestions()
      }
    },
    questionsHandleSizeChange(val) {
      this.questionsParams.pagesize = val
      this.getQuestions()
    },
    questionsHandleCurrentChange(val) {
      this.questionsParams.pagenum = val
      this.getQuestions()
    },
    // 搜索
    searchQuestions() {
      this.questionsParams.query = this.questionskeywords
      this.getQuestions()
    },
    // 删除
    delQuestion(id) {
      this.$confirm('您确定删除该问题吗?', '删除', {
        confirmButtonText: '是的',
        cancelButtonText: '再想想...',
        type: 'info'
      })
        .then(async () => {
          const { data: dt } = await this.$http.delete('/delQuestion/' + id)
          if (dt.meta.status != 200) return this.$message.error(dt.meta.msg)
          this.$message.success(dt.meta.msg)
          this.getQuestions()
        })
        .catch(() => {})
    },
    // 更改状态
    async chnageState(info) {
      console.log(info.id,info.state)
      const { data: dt } = await this.$http.put(
        `/questions/${info.id}/state/${info.state}`
      )
      if (dt.meta.status != 200) {
        this.getQuestions()
        return this.$message.error(dt.meta.msg)
      }
      this.$message.success(dt.meta.msg)
    }
  }
}
</script>
<style lang = 'less'>
</style>

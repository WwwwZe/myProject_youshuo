<template >
  <div>
    <com-crumb n1="评论管理" n2="评论列表"></com-crumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-button type="danger" plain @click="delComments">批量删除</el-button>
        </el-col>
        <el-col :span="8">
          <el-input
            placeholder="请输入要搜索评论相关内容"
            v-model="commentskeywords"
            class="input-with-select search-text"
            clearable
            @clear="searchComments"
            @keyup.enter.native="searchComments"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              class="search-btn"
              @click="searchComments"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table
        ref="commentRef"
        :data="commentList"
        tooltip-effect="dark"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="content" label="评论内容" show-overflow-tooltip></el-table-column>
        <el-table-column prop="publisher" label="发表者" width="150"></el-table-column>
        <el-table-column prop="article" label="被评论文章" show-overflow-tooltip></el-table-column>
        <el-table-column prop="addtime" label="评论日期" width="150"></el-table-column>
        <el-table-column label="显示状态" width="80">
          <template slot-scope="info">
            <el-switch
              v-model="info.row.state"
              active-color="#FFD04B"
              @change="chnageState(info.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="info">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              plain
              round
              @click="delComment(info.row.id)"
            >删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        ref="page"
        @size-change="commentsHandleSizeChange"
        @current-change="commentsHandleCurrentChange"
        :current-page="1"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="commentsTotal"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getCommentList()
  },
  data() {
    return {
      //  搜索评论关键词
      commentskeywords: '',
      //  评论列表
      commentList: [],
      // 被选中的评论
      commentSelection: [],
      // 获取评论所需参数
      commentListParams: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      //  评论总条数
      commentsTotal: 0
    }
  },

  methods: {
    // 选择表格数据时触发
    handleSelectionChange(val) {
      this.commentSelection = val
      // console.log(this.commentSelection)
    },
    //   更改每页显示条数
    commentsHandleSizeChange(val) {
      // console.log(val)
      this.commentListParams.pagesize = val
      this.getCommentList()
    },
    //   更改页数
    commentsHandleCurrentChange(val) {
      // console.log(val)
      this.commentListParams.pagenum = val
      this.getCommentList()
    },
    //  获取评论列表
    async getCommentList() {
      const { data: dt } = await this.$http.get('/getComment', {
        params: this.commentListParams
      })
      // console.log(dt)
      this.commentsTotal = dt.data.pagetotal
      this.commentList = dt.data.comments
      if (this.commentList.length == 0) {
        this.commentListParams.pagenum = Math.ceil(
          this.commentsTotal / this.commentListParams.pagesize
        )
        if (this.commentListParams.pagenum == 0) {
          this.commentListParams.pagenum = 1
        }
        this.getCommentList()
      }
    },
    //  搜索评论
    searchComments() {
      this.commentListParams.query = this.commentskeywords
      this.getCommentList()
    },
    // 改变状态
    async chnageState(info) {
      const { data: dt } = await this.$http.put(
        `/comments/${info.id}/state/${info.state}`
      )
      // console.log(dt)
      if (dt.meta.status != 200) {
        this.getUserList()
        return this.$message.error(dt.meta.msg)
      }
      this.$message.success(dt.meta.msg)
    },
    //  删除单条评论
    async delComment(id) {
      // console.log(id)
      this.$confirm('您确定删除该评论吗?', '删除', {
        confirmButtonText: '是的',
        cancelButtonText: '再想想...',
        type: 'info'
      })
        .then(async () => {
          const { data: dt } = await this.$http.delete(`/delComment/${id}`)
          // console.log(dt)
          if (dt.meta.status != 200) return this.$message.error(dt.meta.msg)
          // // 小bug：最后一页只剩一条删除 删除后数据为空 this.userListParams.pagenum没改变
          // if (this.commentList.length === 1) {
          //   this.commentListParams.pagenum--
          // }
          this.getCommentList()
          this.$message.success(dt.meta.msg)
        })
        .catch(() => {})
    },
    // 批量删除评论
    async delComments() {
      this.$confirm('您确定删除该评论吗?', '删除', {
        confirmButtonText: '是的',
        cancelButtonText: '再想想...',
        type: 'info'
      })
        .then(async () => {
          var idsArr = []
          // console.log(this.commentSelection)
          this.commentSelection.forEach(item => {
            idsArr.push(item.id)
          })
          var ids = idsArr.join(',')
          // console.log(ids)
          const { data: dt } = await this.$http.delete('/delComments', {
            params: { ids: ids }
          })
          if (dt.meta.status != 200) return this.$message.error(dt.meta.msg)
          this.getCommentList()
          this.$message.success(dt.meta.msg)
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang = 'less'>
</style>

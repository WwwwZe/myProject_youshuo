<template >
  <el-container>
    <!-- 顶部 -->
    <el-header>
      <div>
        <span class="title">游说社区后台管理系统</span>
      </div>
      <el-row>
        <el-button type="warning"  size="medium" round plain @click="logout">退出</el-button>
      </el-row>
    </el-header>
    <el-container>
      <!-- 左侧导航 -->
      <el-aside :width="submenuFlag?'65px':'200px'">
        <div class="submenuFlag" @click="submenuFlag=!submenuFlag">|||</div>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#222"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="submenuFlag"
          :collapse-transition="false"
          :unique-opened="true"
          :router="true"
        >
          <el-submenu
            :index="item.id.toString()"
            :style="{width:submenuFlag?'65px':'200px'}"
            v-for="item in menusList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="['iconfont',item.icon]"></i>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="item2.path" v-for="item2 in item.children" :key="item2.id">
                <i class="el-icon-menu"></i>
                {{ item2.name }}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容部分 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenusList()
  },
  data() {
    return {
      // 菜单展开收缩
      submenuFlag: false,
      // 菜单列表数据
      menusList: []
    }
  },
  methods: {
    // 获取菜单列表
    async getMenusList() {
      const { data: dt } = await this.$http.get('/menus')
      // console.log(dt)
      this.menusList = dt.data
    },
    //退出登录
    logout() {
      this.$confirm('您确定退出系统吗?', '退出登录', {
        confirmButtonText: '是的',
        cancelButtonText: '再想想...',
        type: 'info'
      })
        .then(() => {
          window.sessionStorage.removeItem('token')
          window.sessionStorage.removeItem('userid')
          this.$message.success('退出成功')
          this.$router.push('/login')
        })
        .catch(() => {
          //   this.$message.error('退出失败')
        })
    }
  }
}
</script>

<style lang = 'less'>
.el-container {
  height: 100%;
  background-image: linear-gradient(140deg, #483646, #d6b276);
  .el-header {
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #555;
    span.title {
      user-select: none;
      color: #fff;
      font-size: 20px;
      font-family: '\5B8B\4F53';
    }
  }
  .el-aside {
    background-color: #222;
    opacity: 0.5;
    border-right: 1px solid #777;
    .submenuFlag {
      background-color: #111;
      color: #fff;
      text-align: center;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      letter-spacing: 0.1em;
      user-select: none;
      cursor: pointer;
    }
    ul {
      border-right: none;
    }
  }
}
</style>
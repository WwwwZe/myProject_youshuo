<template >
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ n1 }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ n2 }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script>
export default {
  data() {
    return {}
  },
  props: ['n1', 'n2']
}
</script>
<style lang = 'less'>
</style>

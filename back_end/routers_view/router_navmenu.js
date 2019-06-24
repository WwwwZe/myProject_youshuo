const express = require('express')
const router = express.Router()
// 导入菜单接口处理函数
const navmenu = require("../controllers_view/controller_navmenu")

// 获取菜单列表
router.get('/navmenu', navmenu)

module.exports = router
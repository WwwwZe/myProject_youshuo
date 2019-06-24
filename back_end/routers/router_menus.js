const express = require('express')
const router = express.Router()
// 导入菜单接口处理函数
const menus = require("../controllers/controller_menus")

// 获取菜单列表
router.get('/menus', menus)

module.exports = router

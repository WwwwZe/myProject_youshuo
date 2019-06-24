const express = require('express')
const router = express.Router()
// 导入菜单接口处理函数
const navmenu = require("../controllers/controller_navmenu")


router
    // 获取菜单列表
    .get('/navmenu', navmenu.navmenu)

    // 获取单个菜单
    .get("/getNanmenu/:id", navmenu.getNavmenu)

    // 添加菜单
    .post("/addNavmenu", navmenu.addNavmenu)

    // 删除菜单
    .delete("/delNavmenu/:id", navmenu.delNavmenu)

    // 修改菜单
    .put("/editNavmenu/:id", navmenu.editNavmenu)

module.exports = router
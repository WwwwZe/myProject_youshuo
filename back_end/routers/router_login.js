const express = require("express")
const router = express.Router()
// 导入登录接口处理函数
const login = require("../controllers/controller_login")

router
    // 登录验证
    .post("/login",login )

module.exports = router
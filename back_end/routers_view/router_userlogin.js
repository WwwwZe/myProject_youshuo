const express = require("express")
const router = express.Router()
// 导入登录接口处理函数
const userlogin = require("../controllers_view/controller_userlogin")

router
    // 登录验证
    .post("/userlogin",userlogin.userlogin )

    // 退出登录
    .get("/userlogout",userlogin.userlogout )

module.exports = router
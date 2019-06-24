const express = require("express")
const router = express.Router()
// 导入登录接口处理函数
const user = require("../controllers_view/controller_user")

router
    // 添加用户
    .post("/addUser",user.addUser )

    // 修改用户
    .post("/updateUser",user.updateUser )

    // 修改用户密码
    .post("/changePassword",user.changePassword )

module.exports = router
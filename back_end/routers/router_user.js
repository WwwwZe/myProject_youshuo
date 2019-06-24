const express = require("express")
const router = express.Router()
const user = require("../controllers/controller_user")

router
    // 获取用户列表
    .get("/getUser", user.getUser)

    // 根据id查询单个用户信息
    .get("/user/:id", user.userid)

    // 添加用户
    .post("/addUser", user.addUser)

    // 删除用户
    .delete("/delUser/:id", user.delUser)

    // 编辑用户
    .put("/editUser/:id", user.editUser)

    // 更改用户状态
    .put("/users/:id/state/:type", user.usersState)

    // 修改密码
    .put("/editPassword/:id", user.editPassword)

module.exports = router
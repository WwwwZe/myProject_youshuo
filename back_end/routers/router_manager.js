const express = require("express")
const router = express.Router()
const manager = require("../controllers/controller_manager")

router
    // 获取管理员列表
    .get("/getManager", manager.getManager)

     // 根据id查询单个管理员信息
     .get("/manager/:id", manager.managerid)

    // 添加管理员
    .post("/addManager", manager.addManager)

    // 删除管理员
    .delete("/delManager/:id", manager.delManager)

    // 编辑管理员
    .put("/editManager/:id", manager.editManager)

    // 更改管理员状态
    .put("/managers/:id/state/:type", manager.managersState)

    // 修改密码
    .put("/managePassword/:id",manager.password)

module.exports = router
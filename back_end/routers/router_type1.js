const express = require("express")
const router = express.Router()
const type1 = require("../controllers/controller_type1")

router
    // 获取地区类型数据
    .get("/getType1", type1.getType1)

    // 根据id查询单个地区类型信息
    .get("/type1/:id", type1. type1id)

    // 添加地区类型数据
    .post("/addType1", type1.addType1)

    // 删除地区类型数据
    .delete("/delType1/:id", type1.delType1)

    // 编辑地区类型数据
    .put("/editType1/:id", type1.editType1)

module.exports = router
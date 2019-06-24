const express = require("express")
const router = express.Router()
const type2 = require("../controllers/controller_type2")

router
    // 获取攻略类型数据
    .get("/getType2",type2.getType2)

     // 根据id查询单个攻略类型信息
     .get("/type2/:id", type2.type2id)

    // 添加攻略类型数据
    .post("/addType2",type2.addType2)

    // 删除攻略类型数据
    .delete("/delType2/:id",type2.delType2)

    // 编辑地区类型数据
    .put("/editType2/:id", type2.editType2)

module.exports = router
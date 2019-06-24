const express = require("express")
const router = express.Router()
const slide = require("../controllers/controller_slide")

router
    // 获取轮播图
    .get("/getSlide", slide.getSlide)

    // 根据id查询单个地区类型信息
    .get("/slide/:id", slide. slideid)

    // 添加轮播图
    .post("/addSlide", slide.addSlide)

    // 删除轮播图
    .delete("/delSlide/:id", slide.delSlide)

    // 编辑轮播图
    .put("/editslide/:id", slide.editSlide)

module.exports = router
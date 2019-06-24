const express = require("express")
const router = express.Router()
const slide = require("../controllers_view/controller_slide")

router
    // 获取轮播图
    .get("/getSlide", slide)

module.exports = router
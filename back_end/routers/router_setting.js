const express = require("express")
const router = express.Router()
const setting = require("../controllers/controller_setting")

router
    // 获取设置信息
    .get("/getSetting", setting.getSetting)

    // 修改设置信息
    .put("/editSetting/:id", setting.editSetting)

    // 添加删除关键词
    .put("/keyWords/:id", setting.addKeyWords)

module.exports = router
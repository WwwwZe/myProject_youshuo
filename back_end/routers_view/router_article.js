const express = require('express')
const router = express.Router()
const article = require("../controllers_view/controller_article")

router 
    .post("/addArticle",article.addArticle)

    .get("/searchArticle",article.searchArticle)

    .post("/editArticle/:id",article.editArticle)

    .get("/delArticle/:id",article.delArticle)

    // 获取总条数
    .get("/pageTotal",article.pageTotal)

    // 获取当前页数据
    .get("/getPageContent",article.pageContent)

    

module.exports = router
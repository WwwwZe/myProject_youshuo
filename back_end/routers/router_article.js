const express = require("express")
const router = express.Router()
const article = require("../controllers/controller_article")

router
    // 获取文章列表
    .get("/getArticle", article.getArticle)

    // 根据id查询单个文章信息
    .get("/article/:id", article.articleid)

    // 删除文章
    .delete("/delArticle/:id", article.delArticle)

    // 编辑文章
    .put("/editArticle/:id", article.editArticle)

    // 更改文章状态
    .put("/articles/:id/state/:type", article.articlesState)

    // 更改文章焦点状态
    .put("/articles/:id/focus/:type", article.articlesFocus)

module.exports = router
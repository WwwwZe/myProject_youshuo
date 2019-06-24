const express = require('express')
const router = express.Router()
const comment = require("../controllers_view/controller_comment")

// 添加评论
router
    .post('/addComment', comment.addComment)

    .get("/commentPageTotal",comment.commentPageTotal)

    .get("/getCommentPageContent",comment.getCommentPageContent)

module.exports = router
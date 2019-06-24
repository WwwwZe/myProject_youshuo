const express = require('express')
const router = express.Router()
const askComment = require("../controllers_view/controller_askcomment")

// 添加评论
router
    .post('/addAskComment', askComment.addAskComment)

    .get("/answerPageTotal",askComment.answerPageTotal)

    .get("/getAnswerPageContent",askComment.getAnswerPageContent)

module.exports = router
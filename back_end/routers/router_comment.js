const express = require("express")
const router = express.Router()
const comment = require("../controllers/controller_comment")

router 
    // 获取评论列表
    .get("/getComment",comment.getComment)

    // 删除单条评论
    .delete("/delComment/:id",comment.delComment)

    // 批量删除评论
    .delete("/delComments",comment.delComments)

    // 更改评论状态
    .put("/comments/:id/state/:type", comment.commentsState)

module.exports = router
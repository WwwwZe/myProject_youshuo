const express = require('express')
const router = express.Router()
const newquestion = require("../controllers_view/controller_newquestion")

router
    .post('/addNewquestion', newquestion.addNewquestion)
    .get("/searchAsk",newquestion.searchAsk)

    .get("/askPageTotal",newquestion.askPageTotal)

    .get("/getAskPageContent",newquestion.getAskPageContent)

    // 删除问题
    .get("/delAsk/:id",newquestion.delAsk)


module.exports = router
const express = require("express")
const router = express.Router()
const ask = require("../controllers/controller_ask")

router 
    .get("/questions",ask.getQuestions)

    .get("/answers",ask.getAnswers)

    .delete("/delQuestion/:id",ask.delQuestion)

    .delete("/delAnswer/:id",ask.delAnswer)

    .put("/questions/:id/state/:state",ask.questionState)

    .put("/answers/:id/state/:state",ask.answerState)
    

module.exports = router
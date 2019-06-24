const path = require('path')
const db = require('../tools/db')

let answerPage = async (req, res) => {
    const id = req.params.id
    let sql = `select a.*,b.u_nickname from ys_ask a
                    join ys_user b on a.ask_userid = b.u_id
                    where ask_id = ?`
    const result = await db(sql, [id,id])
    const dt = {
        isLocation: req.session.isLocation,
        userInfo: req.session.userInfo,
        ask: result[0]
    }
    if(req.session.userInfo) {
        sql = `select * from ys_user where u_id = ?`
        const rrr = await db(sql,req.session.userInfo.u_id)
        dt.userInfo=rrr[0]
    }
    res.render(path.join(rootPath, "view/pages", "answer.html"), dt)
}

module.exports = answerPage
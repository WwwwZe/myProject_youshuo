const path = require('path')
const db = require('../tools/db')

let memberPage = async (req, res) => {
    // console.log(req.session.isLocation)
    let sql = `select * from ys_article where a_userid = ?;
                select * from ys_ask where ask_userid = ?`
    const result = await db(sql, [req.session.userInfo.u_id,req.session.userInfo.u_id])
    const dt = {
        isLocation: req.session.isLocation,
        userInfo: req.session.userInfo,
        article: result[0],
        ask:result[1]
    }
    if(req.session.userInfo) {
        sql = `select * from ys_user where u_id = ?`
        const rrr = await db(sql,req.session.userInfo.u_id)
        dt.userInfo=rrr[0]
    }
    res.render(path.join(rootPath, "view/pages", "member.html"), dt)
}

module.exports = memberPage
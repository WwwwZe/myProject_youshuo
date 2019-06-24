const path = require('path')
const db = require('../tools/db')

let searchMorePage = async (req, res) => {
    const query = req.params.query
    const type = req.params.type
    let sql=`select * from ys_article 
                where a_title like "%${query}%";
            select * from ys_ask 
                where ask_title like "%${query}%"`
    const rst=await db(sql)
    const dt = {
        isLocation: req.session.isLocation,
        userInfo: req.session.userInfo,
        query: query,
        type: type,
        travelsNum:rst[0].length,
        asksNum:rst[1].length
    }
    if (type == "travels") {
        sql = `select a.*,b.u_nickname from ys_article a
            join ys_user b on a.a_userid = b.u_id
            where a_title like "%${query}%"`
        const result = await db(sql, query)
        dt.list = result
    } else if (type == "asks") {
        sql = `select * from ys_ask a
            join ys_user b on a.ask_userid = b.u_id
            where ask_title like "%${query}%"`
        const result = await db(sql, query)
        dt.list = result
    }
    if (req.session.userInfo) {
        sql = `select * from ys_user where u_id = ?`
        const rrr = await db(sql, req.session.userInfo.u_id)
        dt.userInfo = rrr[0]
    }
    res.render(path.join(rootPath, "view/pages", "searchMore.html"), dt)
}

module.exports = searchMorePage
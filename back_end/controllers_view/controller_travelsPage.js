const path = require('path')
const db = require('../tools/db')

let travelsPage = async (req, res) => {
    let sql = `select * from ys_article order by rand() limit 0,5;
        select * from article_type1`
    const result = await db(sql)
    const nav = []
    result[1].forEach(item => {
        var navObj = {
            id: item.t1_id,
            name: item.t1_name,
            addtime: item.t1_addtime
        }
        nav.push(navObj)
    })
    let data = {
        isLocation: req.session.isLocation,
        userInfo: req.session.userInfo,
        id: -1,
        title: "全部游记",
        rand: result[0],
        nav: nav
    }
    if(req.session.userInfo) {
        sql = `select * from ys_user where u_id = ?`
        const rrr = await db(sql,req.session.userInfo.u_id)
        data.userInfo=rrr[0]
    }
    res.render(path.join(rootPath, "view/pages", "travels.html"), data)
}

module.exports = travelsPage
const path = require('path')
const db = require('../tools/db')

let strategyListPage = async (req, res) => {
    const id = req.params.id
    let sql = `select * from article_type2 where t2_id = ?`
    const result1 = await db(sql, id)
    sql = `select * from ys_article order by rand() limit 0,5;
        select * from article_type2`
    const result2 = await db(sql)
    const nav = []
    result2[1].forEach(item => {
        var navObj = {
            id: item.t2_id,
            name: item.t2_name,
            addtime: item.t2_addtime,
            icon: item.t2_icon
        }
        nav.push(navObj)
    })
    let data = {
        isLocation: req.session.isLocation,
        userInfo: req.session.userInfo,
        id: id,
        title: result1[0].t2_name,
        rand: result2[0],
        nav: nav
    }
    if(req.session.userInfo) {
        sql = `select * from ys_user where u_id = ?`
        const rrr = await db(sql,req.session.userInfo.u_id)
        data.userInfo=rrr[0]
    }
    res.render(path.join(rootPath, "view/pages", "strategy.html"), data)
}

module.exports = strategyListPage
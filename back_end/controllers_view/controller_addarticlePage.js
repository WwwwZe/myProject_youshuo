const path = require('path')
const db = require('../tools/db')

let addarticlePage = async (req, res) => {
    let sql = `select * from ys_user where u_id = ?`
    const rrr = await db(sql,req.session.userInfo.u_id)
    sql = `select * from article_type1;
            select * from article_type2`
    const result = await db(sql)
    const dt = {
        isLocation: req.session.isLocation,
        userInfo: rrr[0],
        type1: result[0],
        type2: result[1]
    }
    res.render(path.join(rootPath, "view/pages", "addArticle.html"), dt)
}

module.exports = addarticlePage
const path = require('path')
const db = require('../tools/db')

let detailPage = async (req, res) => {
    const id = req.params.id
    let sql =`select * from ys_article where a_id = ?`
    const r1= await db(sql,id)
    const click={
        a_click:r1[0].a_click + 1
    }
    sql = `update ys_article set ? where a_id = ?`
    db(sql,[click,id])

    sql = ` select a.*,b.u_nickname,b.u_pic from ys_article a
                        join ys_user b on a.a_userid = b.u_id
                        where a_id = ?;
                select * from ys_article order by rand() limit 0,5`
    const result = await db(sql, [id, id])
    const dt = {
        isLocation: req.session.isLocation,
        userInfo: req.session.userInfo,
        article: result[0][0],
        rand: result[1],
    }
    if(req.session.userInfo) {
        sql = `select * from ys_user where u_id = ?`
        const rrr = await db(sql,req.session.userInfo.u_id)
        dt.userInfo=rrr[0]
    }
    // console.log(dt.comment)
    res.render(path.join(rootPath, "view/pages", "detail.html"), dt)
}

module.exports = detailPage
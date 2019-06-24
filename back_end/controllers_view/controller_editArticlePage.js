const path = require('path')
const db = require('../tools/db')

let editArticlePage = async (req, res) => {
    const id = req.params.id
    const sql = `select * from ys_user where u_id = ?;
                select * from ys_article where a_id = ?;
                select * from article_type1;
                select * from article_type2`
    const result = await db(sql,[req.session.userInfo.u_id,id])
    const dt = {
        isLocation: req.session.isLocation,
        userInfo: result[0][0],
        article: result[1][0],
        type1: result[2],
        type2: result[3]
    }
    dt.article.type2=result[1][0].a_type2id.split(",")

    res.render(path.join(rootPath, "view/pages", "editArticle.html"), dt)
}

module.exports = editArticlePage
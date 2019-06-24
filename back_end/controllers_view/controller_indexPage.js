const path = require('path')
const db = require('../tools/db')

let indexPage = async (req, res) => {
    let sql = `select * from ys_user;
            select * from ys_comment;
            select * from ys_article;
            select * from ys_article where a_focus = 1 and a_state = "已发布" order by a_addtime desc limit 0,4;
            select * from ys_article where a_state = "已发布" order by a_click desc limit 0,5;
            select a.*,b.u_nickname from ys_article a
                            join ys_user b on a.a_userid=b.u_id
                            where a_state = "已发布" order by a_addtime desc limit 0,5;
            select a.*,b.a_title,b.a_id,c.u_pic,c.u_nickname from ys_comment a
                            join ys_article b on a.cmt_articleid=b.a_id
                            join ys_user c on a.cmt_userid=c.u_id
                            where cmt_state = "1" order by cmt_addtime desc limit 0,5;
            select * from ys_ask;
            select * from ys_setting;
            select * from article_type2;
            select * from ys_slide;
            select * from ask_comment`
    const result = await db(sql)
    const dt = {
        userNum: result[0].length,
        commentNum: result[1].length,
        articleNum: result[2].length,
        askNum: result[7].length+result[11].length,
        isLocation: req.session.isLocation,
        userInfo: req.session.userInfo,
        focus: result[3],
        hots: result[4],
        rec: result[5],
        comment: result[6],
        setting: result[8][0],
        subnav: result[9],
        slide: result[10]
    }
    if(req.session.userInfo) {
        sql = `select * from ys_user where u_id = ?`
        const rrr = await db(sql,req.session.userInfo.u_id)
        dt.userInfo=rrr[0]
    }
    res.render(path.join(rootPath, "view", "index.html"), dt)
}

module.exports = indexPage
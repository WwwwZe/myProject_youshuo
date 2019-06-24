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
            select * from ys_ask`
    const result = await db(sql)
    const dt = {
        userNum: result[0].length,
        commentNum: result[1].length,
        articleNum: result[2].length,
        askNum: result[7].length,
        isLocation: req.session.isLocation,
        userInfo: req.session.userInfo,
        focus: result[3],
        hots: result[4],
        rec: result[5],
        comment: result[6]
    }
    res.render(path.join(rootPath, "view", "index.html"), dt)
}

let travelsPage = async (req, res) => {
    let sql = `select * from ys_article order by rand() limit 0,5;
        select a.*,b.u_nickname from ys_article a
                join ys_user b on a.a_userid=b.u_id
                where a_state = "已发布" order by a_addtime desc limit 0,5;
        select * from article_type1`
    const result = await db(sql)
    const nav = []
    result[2].forEach(item => {
        var navObj = {
            id: item.t1_id,
            name: item.t1_name,
            addtime: item.t1_addtime
        }
        nav.push(navObj)
    })
    let data = {
        id: -1,
        title: "全部游记",
        rand: result[0],
        article: result[1],
        nav: nav
    }
    res.render(path.join(rootPath, "view/pages", "travels.html"), data)
}

let travelsListPage = async (req, res) => {
    const id = req.params.id
    let sql = `select * from article_type1 where t1_id = ?`
    const result1 = await db(sql, id)
    sql = `select * from ys_article order by rand() limit 0,5;
        select a.*,b.u_nickname from ys_article a
                join ys_user b on a.a_userid=b.u_id
                where a_state = "已发布" and a_type1id = ?
                order by a_addtime desc limit 0,5;
        select * from article_type1`
    const result2 = await db(sql, id)
    const nav = []
    result2[2].forEach(item => {
        var navObj = {
            id: item.t1_id,
            name: item.t1_name,
            addtime: item.t1_addtime
        }
        nav.push(navObj)
    })
    let data = {
        id: id,
        title: result1[0].t1_name,
        rand: result2[0],
        article: result2[1],
        nav: nav
    }
    res.render(path.join(rootPath, "view/pages", "travels.html"), data)
}

let strategyPage = async (req, res) => {
    let sql = `select * from ys_article order by rand() limit 0,5;
        select a.*,b.u_nickname from ys_article a
                join ys_user b on a.a_userid=b.u_id
                where a_state = "已发布" order by a_addtime desc limit 0,5;
        select * from article_type2`
    const result = await db(sql)
    const nav = []
    result[2].forEach(item => {
        var navObj = {
            id: item.t2_id,
            name: item.t2_name,
            addtime: item.t2_addtime,
            icon: item.t2_icon
        }
        nav.push(navObj)
    })
    let data = {
        id: -1,
        title: "全部游记",
        rand: result[0],
        article: result[1],
        nav: nav
    }
    res.render(path.join(rootPath, "view/pages", "strategy.html"), data)
}

let strategyListPage = async (req, res) => {
    const id = req.params.id
    let sql = `select * from article_type2 where t2_id = ?`
    const result1 = await db(sql, id)
    sql = `select * from ys_article order by rand() limit 0,5;
        select a.*,b.u_nickname from ys_article a
                join ys_user b on a.a_userid=b.u_id
                where a_state = "已发布" and a_type2id like "%${id}%"
                order by a_addtime desc limit 0,5;
        select * from article_type2`
    const result2 = await db(sql)
    const nav = []
    result2[2].forEach(item => {
        var navObj = {
            id: item.t2_id,
            name: item.t2_name,
            addtime: item.t2_addtime,
            icon: item.t2_icon
        }
        nav.push(navObj)
    })
    let data = {
        id: id,
        title: result1[0].t2_name,
        rand: result2[0],
        article: result2[1],
        nav: nav
    }
    res.render(path.join(rootPath, "view/pages", "strategy.html"), data)
}

let loginPage = (req, res) => {
    res.render(path.join(rootPath, "view/pages", "login.html"))
}

let registerPage = (req, res) => {
    res.render(path.join(rootPath, "view/pages", "register.html"))
}

let memberPage = async (req, res) => {
    // if (!req.session.isLocation) {
    //     return res.redirect("/login")
    // }
    console.log(req.session.isLocation)
    const sql = `select * from ys_article where a_userid = ?`
    const result = await db(sql, req.session.userInfo.u_id)
    // console.log(result)
    const dt = {
        isLocation: req.session.isLocation,
        userInfo: req.session.userInfo,
        article: result
    }
    res.render(path.join(rootPath, "view/pages", "member.html"), dt)
}

let addarticlePage = async (req, res) => {
    // if (!req.session.isLocation) {
    //     return res.redirect("/login")
    // }
    const sql = `select * from article_type1;
            select * from article_type2`
    const result = await db(sql)
    const dt = {
        isLocation: req.session.isLocation,
        userInfo: req.session.userInfo,
        type1: result[0],
        type2: result[1]
    }
    res.render(path.join(rootPath, "view/pages", "addArticle.html"), dt)
}

let detailPage = async (req, res) => {
    const id = req.params.id
    const sql = ` select a.*,b.u_nickname,b.u_pic from ys_article a
                        join ys_user b on a.a_userid = b.u_id
                        where a_id = ?;
                select a.*,b.u_nickname from  ys_comment a
                        join ys_user b on a.cmt_userid = b.u_id 
                        where cmt_articleid = ?
                        order by cmt_addtime  desc`
    const result = await db(sql, [id, id])
    const dt = {
        isLocation: req.session.isLocation,
        userInfo: req.session.userInfo,
        article: result[0][0],
        comment: result[1]
    }
    // console.log(dt.comment)
    res.render(path.join(rootPath, "view/pages", "detail.html"), dt)
}

let askPage = (req, res) => {
    const dt = {
        isLocation: req.session.isLocation,
        userInfo: req.session.userInfo,
    }
    res.render(path.join(rootPath, "view/pages", "ask.html"), dt)
}

let answerPage = (req, res) => {
    const dt = {
        isLocation: req.session.isLocation,
        userInfo: req.session.userInfo,
    }
    res.render(path.join(rootPath, "view/pages", "answer.html"), dt)
}

let newquestionPage = (req, res) => {
    const dt = {
        isLocation: req.session.isLocation,
        userInfo: req.session.userInfo,
    }
    res.render(path.join(rootPath, "view/pages", "newQuestion.html"), dt)
}


module.exports = {
    indexPage,
    travelsPage,
    travelsListPage,
    strategyPage,
    strategyListPage,
    loginPage,
    registerPage,
    memberPage,
    addarticlePage,
    detailPage,
    askPage,
    answerPage,
    newquestionPage
}
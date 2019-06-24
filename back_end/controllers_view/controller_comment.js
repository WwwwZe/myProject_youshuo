const db = require("../tools/db")
const moment = require("moment")

let addComment = async (req, res) => {
    // console.log(req.session)
    let data
    if (!req.session.isLocation) {
        data = {
            data: null,
            meta: {
                status: 401,
                msg: "用户未登录"
            }
        }
        return res.send(data)
    }
    const id = req.body.id
    const content = req.body.content
    if (content == "") {
        data = {
            data: null,
            meta: {
                status: 200,
                msg: "内容不能为空"
            }
        }
        return res.send(data)
    };
    const dt = {
        cmt_articleid: id - 0,
        cmt_userid: req.session.userInfo.u_id,
        cmt_content: content,
        cmt_addtime: moment().format("YYYY-MM-DD HH:mm:ss")
    }
    // console.log(dt)
    let sql = `insert into ys_comment set ?`
    const result = await db(sql, dt)
    if (result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                status: 402,
                msg: "评论添加失败"
            }
        }
        return res.send(data)
    }
    dt.u_pic = req.session.userInfo.u_pic
    dt.u_nickname = req.session.userInfo.u_nickname
    data = {
        data: dt,
        meta: {
            status: 200,
            msg: "评论添加成功"
        }
    }
    sql = `select * from ys_comment where cmt_articleid = ?`
    const result1 = await db(sql, id)
    const num = {
        a_cmt: result1.length
    }
    sql = `update ys_article set ? where a_id = ?`
    db(sql, [num, id - 0])
    data.a_cmt = result1.length
    res.send(data)
}

let commentPageTotal = async (req, res) => {
    const id = req.query.id
    const sql = `select count(*) num from ys_comment where cmt_articleid = ?`
    const result = await db(sql,id)
    let data = {
        data: {
            pageNum: Math.ceil(result[0].num / req.query.pageSize)
        },
        meta: {
            msg: "获取成功",
            status: 200
        }
    }
    res.send(data)
}

let getCommentPageContent = async (req, res) => {
    const pageNumF = (req.query.pageNum - 1) * req.query.pageSize;
    const sql = `select a.*,b.u_nickname from  ys_comment a
                join ys_user b on a.cmt_userid = b.u_id 
                where cmt_articleid = ?
                order by cmt_addtime  desc
                limit ${pageNumF},${req.query.pageSize}`
    const result = await db(sql,req.query.id)
    let data = {
        data: result,
        meta: {
            status: 200,
            msg: "获取成功"
        }
    }
    res.send(data)
}

module.exports =  {
    addComment,
    commentPageTotal,
    getCommentPageContent
}
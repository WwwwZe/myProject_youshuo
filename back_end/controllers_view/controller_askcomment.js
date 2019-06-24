const db = require("../tools/db")
const moment = require("moment")

let addAskComment = async (req, res) => {
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
        ac_askid: id - 0,
        ac_userid: req.session.userInfo.u_id,
        ac_content: content,
        ac_addtime: moment().format("YYYY-MM-DD HH:mm:ss")
    }
    // console.log(dt)
    let sql = `insert into ask_comment set ?`
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
    sql = `select * from ask_comment where ac_askid = ?`
    const result1 = await db(sql, id)
    const num = {
        ask_cmt: result1.length
    }
    sql = `update ys_ask set ? where ask_id = ?`
    db(sql, [num, id-0])
    data.ask_cmt = result1.length
    res.send(data)
}

let answerPageTotal = async (req, res) => {
    const id = req.query.id
    const sql = `select count(*) num from ask_comment where ac_askid = ?`
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

let getAnswerPageContent = async (req, res) => {
    const pageNumF = (req.query.pageNum - 1) * req.query.pageSize;
    const sql = `select a.*,b.u_nickname,b.u_pic from ask_comment a
                    join ys_user b on a.ac_userid = b.u_id
                    where ac_askid = ?
                    order by ac_addtime desc
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

module.exports = {
    addAskComment,
    answerPageTotal,
    getAnswerPageContent
}
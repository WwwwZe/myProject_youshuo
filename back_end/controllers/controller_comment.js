const db = require("../tools/db")

// 获取评论列表
let getComment = async (req, res) => {
    const pagenumF = (req.query.pagenum - 1) * req.query.pagesize
    let sql = `select a.*,b.u_nickname,c.a_title from ys_comment a 
                join ys_user b on a.cmt_userid = b.u_id 
                join ys_article c on a.cmt_articleid = c.a_id 
                order by cmt_id 
                limit ${pagenumF},${req.query.pagesize}`
    if (req.query.query != '') {
        sql = `select a.*,b.u_nickname,c.a_title from ys_comment a 
                join ys_user b on a.cmt_userid = b.u_id 
                join ys_article c on a.cmt_articleid = c.a_id 
                where cmt_content like '%${req.query.query}%' 
                order by cmt_id 
                limit ${pagenumF},${req.query.pagesize}`
    }
    let data
    const result = await db(sql)
    // console.log(result)
    if (typeof result != 'object') {
        data = {
            data: null,
            meta: {
                msg: '获取评论列表失败',
                status: 400
            }
        }
        return res.send(data)
    }
    sql = `select a.*,b.u_nickname,c.a_title from ys_comment a 
                join ys_user b on a.cmt_userid = b.u_id 
                join ys_article c on a.cmt_articleid = c.a_id `
    if (req.query.query != '') {
        sql = `select a.*,b.u_nickname,c.a_title from ys_comment a 
                join ys_user b on a.cmt_userid = b.u_id 
                join ys_article c on a.cmt_articleid = c.a_id 
                where cmt_content like '%${req.query.query}%' `
    }
    const resu = await db(sql)
    if (typeof result != 'object') return console.log(resu);
    const total = resu.length
    // console.log(total)
    var dt = []
    result.forEach(item => {
        dt.push({
            id: item.cmt_id,
            content: item.cmt_content,
            publisherid: item.cmt_userid,
            publisher: item.u_nickname,
            articleid: item.cmt_articleid,
            article: item.a_title,
            addtime: item.cmt_addtime,
            state: item.cmt_state == '1' ? true : false,
        })
    })
    data = {
        data: {
            pagetotal: total,
            pagenum: req.query.pagenum,
            comments: dt
        },
        meta: {
            msg: "获取评论列表成功!",
            status: 200
        }
    }
    res.send(data)
}

// 删除单挑评论
let delComment = async (req, res) => {
    const id = req.params.id
    let data
    const sql = "delete from ys_comment where cmt_id = ?"
    const result = await db(sql, id)
    // console.log(result)
    if (typeof result != 'object' || result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                msg: '删除评论失败',
                status: 400
            }
        }
        return res.send(data)
    }
    data = {
        data: null,
        meta: {
            msg: '删除评论成功',
            status: 200
        }
    }
    res.send(data)
}

// 批量伤处评论
let delComments = async (req, res) => {
    var ids = req.query.ids
    // console.log(req.query)
    // console.log(req.body)
    const sql = `delete from ys_comment where cmt_id in (${ids})`
    const result = db(sql)
    if (typeof result != 'object') {
        data = {
            data: null,
            meta: {
                msg: '删除评论失败',
                status: 400
            }
        }
        return res.send(data)
    }
    data = {
        data: null,
        meta: {
            msg: '删除评论成功',
            status: 200
        }
    }
    res.send(data)
}

// 更改评论状态
let commentsState = async (req, res) => {
    // console.log(req.params)
    const id = req.params.id
    // console.log(typeof req.params.type)
    const state = req.params.type == 'true' ? '1' : '0'
    const dt = {
        cmt_state: state
    }
    // console.log(dt)
    let sql = `update ys_comment set ? where cmt_id = ?`
    const result = await db(sql, [dt, id])
    if (typeof result != 'object' || result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                msg: '更改评论状态失败',
                status: 400
            }
        }
        return res.send(data)
    }
    data = {
        data: null,
        meta: {
            msg: '更改评论状态成功',
            status: 200
        }
    }
    res.send(data)
}

module.exports = {
    getComment,
    delComment,
    delComments,
    commentsState
}
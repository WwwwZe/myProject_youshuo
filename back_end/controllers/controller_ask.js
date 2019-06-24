const db = require("../tools/db")

let getQuestions = async (req, res) => {
    // console.log(req.query)
    const pagenumF = (req.query.pagenum - 1) * req.query.pagesize
    let sql = `select a.*,b.u_nickname from ys_ask a
                join ys_user b on a.ask_userid = b.u_id
                order by ask_id 
                limit ${pagenumF},${req.query.pagesize}`
    if (req.query.query != '') {
        sql = `select a.*,b.u_nickname from ys_ask a
                join ys_user b on a.ask_userid = b.u_id
                where ask_title like '%${req.query.query}%' 
                order by ask_id 
                limit ${pagenumF},${req.query.pagesize}`
    }
    let data
    const result = await db(sql)
    // console.log(result)
    if (typeof result != 'object') {
        data = {
            data: null,
            meta: {
                msg: '获取问题列表失败',
                status: 400
            }
        }
        return res.send(data)
    }
    sql = `select a.*,b.u_nickname from ys_ask a
                join ys_user b on a.ask_userid = b.u_id`
    if (req.query.query != '') {
        sql = `select a.*,b.u_nickname from ys_ask a
                join ys_user b on a.ask_userid = b.u_id
                where ask_title like '%${req.query.query}%' `
    }
    const resu = await db(sql)
    if (typeof result != 'object') return console.log(resu);
    const total = resu.length
    // console.log(total)
    var dt = []
    result.forEach(item => {
        dt.push({
            id: item.ask_id,
            title: item.ask_title,
            content: item.ask_content,
            userid: item.ask_userid,
            addtime: item.ask_addtime,
            state: item.ask_state == '1' ? true : false,
            author: item.u_nickname
        })
    })
    data = {
        data: {
            pagetotal: total,
            pagenum: req.query.pagenum,
            questions: dt
        },
        meta: {
            msg: "获取问题列表成功!",
            status: 200
        }
    }
    res.send(data)
}

let getAnswers = async (req, res) => {
    // console.log(req.query)
    const pagenumF = (req.query.pagenum - 1) * req.query.pagesize
    let sql = `select a.*,b.u_nickname,c.ask_title from ask_comment a
                join ys_user b on a.ac_userid = b.u_id
                join ys_ask c on a.ac_askid = c.ask_id
                order by ac_id 
                limit ${pagenumF},${req.query.pagesize-0}`
    if (req.query.query != '') {
        sql = `select a.*,b.u_nickname,c.ask_title from ask_comment a
                join ys_user b on a.ac_userid = b.u_id
                join ys_ask c on a.ac_askid = c.ask_id
                where ac_content like '%${req.query.query}%' 
                order by ac_id 
                limit ${pagenumF},${req.query.pagesize}`
    }
    let data
    const result = await db(sql)
    // console.log(result)
    if (typeof result != 'object') {
        data = {
            data: null,
            meta: {
                msg: '获取回答列表失败',
                status: 400
            }
        }
        return res.send(data)
    }
    sql = `select a.*,b.u_nickname,c.ask_title from ask_comment a
                join ys_user b on a.ac_userid = b.u_id
                join ys_ask c on a.ac_askid = c.ask_id`
    if (req.query.query != '') {
        sql = `select a.*,b.u_nickname,c.ask_title from ask_comment a
                join ys_user b on a.ac_userid = b.u_id
                join ys_ask c on a.ac_askid = c.ask_id
                where ac_content like '%${req.query.query}%' `
    }
    const resu = await db(sql)
    if (typeof result != 'object') return console.log(resu);
    const total = resu.length
    // console.log(total)
    var dt = []
    result.forEach(item => {
        dt.push({
            id: item.ac_id,
            content: item.ac_content,
            askid: item.ac_askid,
            userid: item.ac_userid,
            addtime: item.ac_addtime,
            state: item.ac_state == '1' ? true : false,
            author: item.u_nickname,
            ask: item.ask_title
        })
    })
    data = {
        data: {
            pagetotal: total,
            pagenum: req.query.pagenum,
            answers: dt
        },
        meta: {
            msg: "获取回答列表成功!",
            status: 200
        }
    }
    res.send(data)
}

let delQuestion = async (req, res) => {
    let data
    const id = req.params.id
    const sql = `delete from ys_ask where ask_id = ?`
    const result = await db(sql, id)
    if (result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                status: 400,
                msg: "删除失败"
            }
        }
        res.send(data)
    }
    data = {
        data: null,
        meta: {
            status: 200,
            msg: "删除成功"
        }
    }
    res.send(data)
}

let delAnswer = async (req, res) => {
    let data
    const id = req.params.id
    const sql = `delete from ask_comment where ac_id = ?`
    const result = await db(sql, id)
    if (result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                status: 400,
                msg: "删除失败"
            }
        }
        res.send(data)
    }
    data = {
        data: null,
        meta: {
            status: 200,
            msg: "删除成功"
        }
    }
    res.send(data)
}

let questionState = async (req, res) => {
    const id = req.params.id
    const state = req.params.state == 'true' ? '1' : '0'
    const dt = {
        ask_state: state
    }
    let sql = `update ys_ask set ? where ask_id = ?`
    const result = await db(sql, [dt, id])
    if (typeof result != 'object' || result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                msg: '更改状态失败',
                status: 400
            }
        }
        return res.send(data)
    }
    data = {
        data: null,
        meta: {
            msg: '更改状态成功',
            status: 200
        }
    }
    res.send(data)
}

let answerState = async (req, res) => {
    const id = req.params.id
    const state = req.params.state == 'true' ? '1' : '0'
    const dt = {
        ac_state: state
    }
    let sql = `update ask_comment set ? where ac_id = ?`
    const result = await db(sql, [dt, id])
    if (typeof result != 'object' || result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                msg: '更改状态失败',
                status: 400
            }
        }
        return res.send(data)
    }
    data = {
        data: null,
        meta: {
            msg: '更改状态成功',
            status: 200
        }
    }
    res.send(data)
}
module.exports = {
    getQuestions,
    getAnswers,
    delQuestion,
    delAnswer,
    questionState,
    answerState
}
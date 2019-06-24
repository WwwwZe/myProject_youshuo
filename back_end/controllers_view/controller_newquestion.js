const db = require("../tools/db")
const moment = require("moment")

let addNewquestion = async (req, res) => {
    let data
    var dt = {
        ask_title: req.body.title,
        ask_content: req.body.content,
        ask_userid: req.session.userInfo.u_id,
        ask_addtime: moment().format("YYYY-MM-DD"),
    }
    const sql = `insert into ys_ask set ?`
    const result = await db(sql, dt)
    if (result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                status: 400,
                msg: "问题添加失败"
            }
        }
        return res.send(data)
    }
    data = {
        data: dt,
        meta: {
            status: 200,
            msg: "问题添加成功"
        }
    }
    res.send(data)
}

let searchAsk = async (req, res) => {
    const query = req.query.query;
    if (query == "") return;
    let sql = `select * from ys_ask 
                where ask_title like "%${query}%"
                limit 0,5`
    const result = await db(sql)
    var data = {
        data: result,
        meta: {
            status: 200,
            msg: "搜索成功"
        }
    }
    res.send(data)
}

let askPageTotal = async (req, res) => {
    const sql = `select count(*) num from ys_ask`
    const result = await db(sql)
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

let getAskPageContent = async (req, res) => {
    const pageNumF = (req.query.pageNum - 1) * req.query.pageSize;
    const sql = `select a.*,b.u_nickname from ys_ask a
                join ys_user b on a.ask_userid = b.u_id
                where ask_state = "1"
                order by ask_id desc
                limit ${pageNumF},${req.query.pageSize}`
    const result = await db(sql)
    let data = {
        data: result,
        meta: {
            status: 200,
            msg: "获取成功"
        }
    }
    res.send(data)
}

let delAsk = async (req, res) => {
    let data
    const id = req.params.id
    const sql = `delete from ys_ask where ask_id = ?`
    const result = await db(sql, id)
    if (result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                status: 400,
                msg: "删除问题失败"
            }
        }
        res.send(data)
    }
    data = {
        data: null,
        meta: {
            status: 200,
            msg: "删除问题成功"
        }
    }
    res.send(data)
}

module.exports = {
    addNewquestion,
    searchAsk,
    askPageTotal,
    getAskPageContent,
    delAsk
}
const db = require("../tools/db")
const moment = require("moment")

let addArticle = async (req, res) => {
    let data
    var dt = {
        a_title: req.body.title,
        a_text: req.body.content,
        a_userid: req.session.userInfo.u_id,
        a_type1id: req.body.type1,
        a_addtime: moment().format(),
        a_file: req.body.file,
        a_desc: req.body.desc,
        a_state: req.body.state
    }
    if (req.body.type2 instanceof Array) {
        dt.a_type2id = req.body.type2.join(",")
    } else {
        dt.a_type2id = req.body.type2 + ""
    }
    const sql = `insert into ys_article set ?`
    const result = await db(sql, dt)
    if (result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                status: 400,
                msg: "游记添加失败"
            }
        }
        return res.send(data)
    }
    dt.a_text = "..."
    data = {
        data: dt,
        meta: {
            status: 200,
            msg: "游记添加成功"
        }
    }
    res.send(data)
}
let searchArticle = async (req, res) => {
    const query = req.query.query;
    if (query == "") return;
    let sql = `select * from ys_article 
                where a_title like "%${query}%"
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

let editArticle = async (req, res) => {
    var dt = {
        a_title: req.body.title,
        a_text: req.body.content,
        a_type1id: req.body.type1,
        a_update: moment().format("YYYY-MM-DD"),
        a_file: req.body.file,
        a_desc: req.body.desc,
        a_state: req.body.state
    }
    if (req.body.type2 instanceof Array) {
        dt.a_type2id = req.body.type2.join(",")
    } else {
        dt.a_type2id = req.body.type2 + ""
    }
    let data
    const sql = `update ys_article set ? where a_id = ?`
    const result = await db(sql, [dt, req.params.id])
    if (result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                status: 400,
                msg: "游记修改失败"
            }
        }
        return res.send(data)
    }
    dt.a_text = "..."
    data = {
        data: dt,
        meta: {
            status: 200,
            msg: "游记修改成功"
        }
    }
    res.send(data)
}

let delArticle = async (req, res) => {
    let data
    const id = req.params.id
    const sql = `delete from ys_article where a_id = ?`
    const result = await db(sql, id)
    if (result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                status: 400,
                msg: "删除游记失败"
            }
        }
        res.send(data)
    }
    data = {
        data: null,
        meta: {
            status: 200,
            msg: "删除游记成功"
        }
    }
    res.send(data)
}

// 获取页数
let pageTotal = async (req, res) => {
    let sql
    if (req.query.id) {
        if (req.query.type == "type1") {
            sql = `select count(*) num from ys_article where a_type1id = ${req.query.id}`
        } else if (req.query.type == "type2") {
            sql = `select count(*) num from ys_article where a_type2id like "%${req.query.id}%"`
        }
    } else {
        sql = `select count(*) num from ys_article`
    }
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

// 获取当前页数数据
let pageContent = async (req, res) => {
    let sql
    const pageNumF = (req.query.pageNum - 1) * req.query.pageSize;
    if (req.query.id) {
        if (req.query.type == "type1") {
            sql = `select a.*,b.u_nickname from ys_article a
                join ys_user b on a.a_userid=b.u_id
                where a_state = "已发布" and a_type1id = ${req.query.id}
                order by a_addtime desc 
                limit ${pageNumF},${req.query.pageSize}`
        } else if (req.query.type == "type2") {
            sql = `select a.*,b.u_nickname from ys_article a
                join ys_user b on a.a_userid=b.u_id
                where a_state = "已发布" and a_type2id like "%${req.query.id}%"
                order by a_addtime desc
                limit ${pageNumF},${req.query.pageSize}`
        }
    } else {
        sql = `select a.*,b.u_nickname from ys_article a
                join ys_user b on a.a_userid=b.u_id
                where a_state = "已发布" 
                order by a_addtime desc
                limit ${pageNumF},${req.query.pageSize}`
    }




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

module.exports = {
    addArticle,
    searchArticle,
    editArticle,
    delArticle,
    pageTotal,
    pageContent
}
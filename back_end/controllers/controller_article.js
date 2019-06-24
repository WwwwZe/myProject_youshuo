const db = require("../tools/db")
const moment = require("moment")

// 获取文章列表
let getArticle = (req, res) => {
    // console.log(req.query)
    async function eSql() {
        const pagenumF = (req.query.pagenum - 1) * req.query.pagesize
        let sql = `select a.*,b.u_nickname from ys_article a 
        join ys_user b on a.a_userid = b.u_id
        order by a_id desc
        limit ${pagenumF},${req.query.pagesize}`
        if (req.query.query != '') {
            sql = `select a.*,b.u_nickname from ys_article a 
            join ys_user b on a.a_userid = b.u_id 
            where a.a_title like '%${req.query.query}%' 
            order by a_id 
            limit ${pagenumF},${req.query.pagesize}`
        }
        let data
        const result = await db(sql)
        // console.log(result)
        if (typeof result != 'object') {
            data = {
                data: null,
                meta: {
                    msg: '获取文章列表失败',
                    status: 400
                }
            }
            return res.send(data)
        }
        sql = `select a.*,b.u_nickname from ys_article a 
                join ys_user b on a.a_userid = b.u_id `
        if (req.query.query != '') {
            sql = `select a.*,b.u_nickname from ys_article a 
                join ys_user b on a.a_userid = b.u_id 
                where a.a_title like '%${req.query.query}%' `
        }
        const resu = await db(sql)
        if (typeof result != 'object') return console.log(resu);
        const total = resu.length
        // console.log(total)
        var dt = []
        result.forEach(item => {
            var t2 = item.a_type2id.trim().split(",")
            dt.push({
                id: item.a_id,
                title: item.a_title,
                text: item.a_text,
                userid: item.a_userid,
                author: item.u_nickname,
                type1: item.a_type1id,
                type2: t2,
                state: item.a_state == '已发布' ? true : false,
                file: item.a_file,
                desc: item.a_desc,
                addtime: item.a_addtime,
                click: item.a_click,
                good: item.a_good,
                bad: item.a_bad,
                cmt: item.a_cmt,
                focus: item.a_focus == 1 ? true : false
            })
        })
        data = {
            data: {
                pagetotal: total,
                pagenum: req.query.pagenum,
                articles: dt
            },
            meta: {
                msg: "获取文章列表成功!",
                status: 200
            }
        }
        res.send(data)
    }
    eSql()
}

// 根据id查询单个文章信息
let articleid = async (req, res) => {
    const id = req.params.id
    // console.log(id)
    let data
    let sql = `select * from ys_article where a_id = ?`
    const result = await db(sql, id)
    if (result.length != 1 || typeof result != 'object') {
        data = {
            data: null,
            meta: {
                msg: '获取失败',
                status: 400
            }
        }
        return res.send(data)
    }
    data = {
        data: {
            id: result[0].a_id,
            title: result[0].a_title,
            text: result[0].a_text,
            userid: result[0].a_userid,
            author: result[0].u_nickname,
            type1: result[0].a_type1id,
            type2: result[0].a_type2id.trim().split(","),
            state: result[0].a_state == '已发布' ? true : false,
            file: result[0].a_file,
            desc: result[0].a_desc,
            addtime: result[0].a_addtime,
            click: result[0].a_click,
            good: result[0].a_good,
            bad: result[0].a_bad,
            cmt: result[0].a_cmt,
            focus: result[0].a_focus
        },
        meta: {
            msg: '获取成功',
            status: 200
        }
    }
    res.send(data)
}

// 删除文章
let delArticle = (req, res) => {
    async function eSql3() {
        const id = req.params.id
        let data
        const sql = "delete from ys_article where a_id = ?"
        const result = await db(sql, id)
        // console.log(result)
        if (typeof result != 'object' || result.affectedRows != 1) {
            data = {
                data: null,
                meta: {
                    msg: '删除文章失败',
                    status: 400
                }
            }
            return res.send(data)
        }
        data = {
            data: null,
            meta: {
                msg: '删除文章成功',
                status: 200
            }
        }
        res.send(data)
    }
    eSql3()
}

// 编辑文章
let editArticle = (req, res) => {
    // console.log(req.params.id)
    // console.log(req.body.type2)
    async function eSql4() {
        const id = req.params.id
        const dt = {
            a_title: req.body.title,
            a_desc: req.body.desc,
            a_type1id: req.body.type1,
            a_type2id: req.body.type2
        }
        let data
        let sql = `update ys_article set ? where a_id = ?`
        const result = await db(sql, [dt, id])
        // console.log(result)
        if (typeof result != 'object' || result.affectedRows != 1) {
            data = {
                data: null,
                meta: {
                    msg: '修改文章信息失败',
                    status: 400
                }
            }
            return res.send(data)
        }
        dt.u_id = req.params.id
        data = {
            data: dt,
            meta: {
                msg: '修改文章信息成功',
                status: 200
            }
        }
        res.send(data)
    }
    eSql4()
}

// 更改文章状态
let articlesState = (req, res) => {
    // console.log(req.params)
    async function eSql5() {
        const id = req.params.id
        // console.log(typeof req.params.type)
        const state = req.params.type == 'true' ? '已发布' : '草稿'
        const dt = {
            a_state: state
        }
        // console.log(dt)
        let sql = `update ys_article set ? where a_id = ?`
        const result = await db(sql, [dt, id])
        if (typeof result != 'object' || result.affectedRows != 1) {
            data = {
                data: null,
                meta: {
                    msg: '更改文章状态失败',
                    status: 400
                }
            }
            return res.send(data)
        }
        data = {
            data: null,
            meta: {
                msg: '更改文章状态成功',
                status: 200
            }
        }
        res.send(data)
    }
    eSql5()
}

// 更改文章焦点状态
let articlesFocus = async (req, res) => {
    // console.log(req.params)
    const id = req.params.id
    // console.log(typeof req.params.type)
    const focus = req.params.type == 'true' ? '1' : '2'
    const dt = {
        a_focus: focus
    }
    // console.log(dt)
    let sql = `update ys_article set ? where a_id = ?`
    const result = await db(sql, [dt, id])
    if (typeof result != 'object' || result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                msg: '更改文章焦点状态失败',
                status: 400
            }
        }
        return res.send(data)
    }
    data = {
        data: null,
        meta: {
            msg: '更改文章焦点状态成功',
            status: 200
        }
    }
    res.send(data)
}


module.exports = {
    getArticle,
    articleid,
    delArticle,
    editArticle,
    articlesState,
    articlesFocus
}
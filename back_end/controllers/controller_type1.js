const db = require("../tools/db")
const moment = require("moment")

// 获取文章地区分类数据
let getType1 = async (req, res) => {
    let data
    let sql = "select * from article_type1"
    const result = await db(sql)
    if (typeof result != 'object') {
        data = {
            data: null,
            meta: {
                msg: "获取地区类型失败",
                status: 400
            }
        }
        return res.send(data)
    }
    var dt = []
    result.forEach(item => {
        dt.push({
            id: item.t1_id,
            name: item.t1_name,
            addtime: item.t1_addtime,
        })
    })
    data = {
        data: dt,
        meta: {
            msg: "获取地区类型成功",
            status: 200
        }
    }
    res.send(data)
}

// 根据id查询单个地区类型信息
let type1id = async (req, res) => {
    const id = req.params.id
    // console.log(id)
    let data
    let sql = `select * from article_type1 where t1_id = ?`
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
            id: result[0].t1_id,
            name: result[0].t1_name,
            addtime: result[0].t1_addtime
        },
        meta: {
            msg: '获取成功',
            status: 200
        }
    }
    res.send(data)
}

// 添加地区类型数据
let addType1 = async (req, res) => {
    let data
    const dt = {
        t1_name: req.body.name,
        t1_addtime: moment().format("YYYY-MM-DD")
    }
    const sql = "insert into article_type1 set ?"
    const result = await db(sql, dt)
    if (typeof result != 'object' || result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                msg: '添加地区类型数据失败',
                status: 400
            }
        }
        return res.send(data)
    }
    data = {
        data: null,
        meta: {
            msg: '添加地区类型数据成功',
            status: 200
        }
    }
    res.send(data)
}

// 删除地区类型数据
let delType1 = async (req, res) => {
    let data
    const sql = "delete from article_type1 where t1_id = ?"
    const result = await db(sql, req.params.id)
    if (typeof result != 'object' || result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                msg: '删除地区类型数据失败',
                status: 400
            }
        }
        return res.send(data)
    }
    data = {
        data: null,
        meta: {
            msg: '删除地区类型数据成功',
            status: 200
        }
    }
    res.send(data)
}

// 编辑地区类型数据
let editType1 = async (req, res) => {
    const id = req.params.id
    const dt = {
        t1_name: req.body.name
    }
    const sql = `update article_type1 set ? where t1_id = ?`
    const result = await db(sql, [dt, id])
    if (typeof result != 'object' || result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                msg: '修改地区类型数据失败',
                status: 400
            }
        }
        return res.send(data)
    }
    dt.t1_id = req.params.id
    data = {
        data: dt,
        meta: {
            msg: '修改地区类型数据成功',
            status: 200
        }
    }
    res.send(data)
}

module.exports = {
    getType1,
    type1id,
    addType1,
    delType1,
    editType1
}
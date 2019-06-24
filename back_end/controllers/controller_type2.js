const db = require("../tools/db")
const moment = require("moment")

// 获取文章攻略分类数据
let getType2 = async (req, res) => {
    let data
    let sql = "select * from article_type2"
    const result = await db(sql)
    if (typeof result != 'object') {
        data = {
            data: null,
            meta: {
                msg: "获取攻略类型失败",
                status: 400
            }
        }
        return res.send(data)
    }
    var dt = []
    result.forEach(item => {
        dt.push({
            id: item.t2_id,
            name: item.t2_name,
            addtime: item.t2_addtime,
            icon: item.t2_icon,
            desc: item.t2_desc
        })
    })
    data = {
        data: dt,
        meta: {
            msg: "获取攻略类型成功",
            status: 200
        }
    }
    res.send(data)
}

// 根据id查询单个攻略类型信息
let type2id = async (req, res) => {
    const id = req.params.id
    // console.log(id)
    let data
    let sql = `select * from article_type2 where t2_id = ?`
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
            id: result[0].t2_id,
            name: result[0].t2_name,
            icon: result[0].t2_icon,
            addtime: result[0].t2_addtime
        },
        meta: {
            msg: '获取成功',
            status: 200
        }
    }
    res.send(data)
}

// 添加攻略类型数据
let addType2 = async (req, res) => {
    //  console.log(req.body)
    let data
    const dt = {
        t2_name: req.body.name,
        t2_icon: req.body.icon,
        t2_addtime: moment().format("YYYY-MM-DD")
    }
    const sql = "insert into article_type2 set ?"
    const result = await db(sql, dt)
    if (typeof result != 'object' || result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                msg: '添加攻略类型数据失败',
                status: 400
            }
        }
        return res.send(data)
    }
    data = {
        data: null,
        meta: {
            msg: '添加攻略类型数据成功',
            status: 200
        }
    }
    res.send(data)
}

// 删除攻略类型数据
let delType2 = async (req, res) => {
    let data
    const sql = "delete from article_type2 where t2_id = ?"
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

// 编辑攻略类型数据
let editType2 = async (req, res) => {
    // console.log(req.body.icon)
    const id = req.params.id
    const dt = {
        t2_name: req.body.name,
        t2_icon: req.body.icon
    }
    const sql = `update article_type2 set ? where t2_id = ?`
    const result = await db(sql, [dt, id])
    if (typeof result != 'object' || result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                msg: '修改攻略类型数据失败',
                status: 400
            }
        }
        return res.send(data)
    }
    dt.t2_id = req.params.id
    data = {
        data: dt,
        meta: {
            msg: '修改攻略类型数据成功',
            status: 200
        }
    }
    res.send(data)
}

module.exports = {
    getType2,
    type2id,
    addType2,
    delType2,
    editType2
}
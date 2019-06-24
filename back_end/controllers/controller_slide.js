const db = require("../tools/db")
const moment = require("moment")

// 获取轮播图
let getSlide = async (req, res) => {
    let data
    let sql = "select * from ys_slide"
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
            id: item.s_id,
            url: item.s_url,
            text: item.s_text,
            link: item.s_link,
            addtime: item.s_addtime
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
let slideid = async (req, res) => {
    const id = req.params.id
    // console.log(id)
    let data
    let sql = `select * from ys_slide where s_id = ?`
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
            id: result[0].s_id,
            url: result[0].s_url,
            text: result[0].s_text,
            link: result[0].s_link,
            addtime: result[0].s_addtime
        },
        meta: {
            msg: '获取成功',
            status: 200
        }
    }
    res.send(data)
}

// 添加轮播图
let addSlide = async (req, res) => {
    let data
    const dt = {
        s_url: req.body.url,
        s_text: req.body.text,
        s_link: req.body.link,
        s_addtime: moment().format("YYYY-MM-DD")
    }
    const sql = "insert into ys_slide set ?"
    const result = await db(sql, dt)
    if (typeof result != 'object' || result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                msg: '添加轮播图失败',
                status: 400
            }
        }
        return res.send(data)
    }
    data = {
        data: null,
        meta: {
            msg: '添加轮播图成功',
            status: 200
        }
    }
    res.send(data)
}

// 删除地区类型数据
let delSlide = async (req, res) => {
    let data
    const sql = "delete from ys_slide where s_id = ?"
    const result = await db(sql, req.params.id)
    if (typeof result != 'object' || result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                msg: '删除轮播图失败',
                status: 400
            }
        }
        return res.send(data)
    }
    data = {
        data: null,
        meta: {
            msg: '删除轮播图成功',
            status: 200
        }
    }
    res.send(data)
}

// 编辑地区类型数据
let editSlide = async (req, res) => {
    const id = req.params.id
    const dt = {
        s_text: req.body.text,
        s_link: req.body.link
    }
    const sql = `update ys_slide set ? where s_id = ?`
    const result = await db(sql, [dt, id])
    if (typeof result != 'object' || result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                msg: '修改轮播图失败',
                status: 400
            }
        }
        return res.send(data)
    }
    dt.s_id = req.params.id
    data = {
        data: dt,
        meta: {
            msg: '修改轮播图成功',
            status: 200
        }
    }
    res.send(data)
}

module.exports = {
    getSlide,
    slideid,
    addSlide,
    delSlide,
    editSlide
}
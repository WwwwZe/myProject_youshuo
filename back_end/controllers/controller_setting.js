const db = require("../tools/db")
const moment = require("moment")

// 获取设置信息
let getSetting = async (req, res) => {
    let data
    let sql = "select * from ys_setting"
    const result = await db(sql)
    if (typeof result != 'object') {
        data = {
            data: null,
            meta: {
                msg: "获取设置信息失败",
                status: 400
            }
        }
        return res.send(data)
    }
    var dt = {}
    if (result[0].st_keywords == '' || result[0].st_keywords == null) {
        dt.keywords = []
    } else {
        dt.keywords = result[0].st_keywords.split(',')
    }
    dt.id = result[0].st_id
    dt.title = result[0].st_title
    dt.description = result[0].st_description
    dt.update = result[0].st_update
    data = {
        data: dt,
        meta: {
            msg: "获取设置信息成功",
            status: 200
        }
    }
    res.send(data)
}

// 修改设置信息
let editSetting = async (req, res) => {
    const id = req.params.id
    const dt = {
        st_title: req.body.title,
        st_description: req.body.description,
        st_update: moment().format("YYYY-MM-DD")
    }
    // console.log(id,dt)
    const sql = `update ys_setting set ? where st_id = ?`
    const result = await db(sql, [dt, id])
    if (typeof result != 'object' || result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                msg: '修改设置失败',
                status: 400
            }
        }
        return res.send(data)
    }
    dt.st_id = req.params.id
    data = {
        data: dt,
        meta: {
            msg: '修改设置成功',
            status: 200
        }
    }
    res.send(data)
}

// 添加删除关键词
let addKeyWords = async (req, res) => {
    const id = req.params.id
    const dt = {
        st_keywords: req.body.keywords,
    }
    const sql = `update ys_setting set ? where st_id = ?`
    const result = await db(sql, [dt, id])
    if (typeof result != 'object' || result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                msg: '操作失败',
                status: 400
            }
        }
        return res.send(data)
    }
    dt.st_id = req.params.id
    data = {
        data: dt,
        meta: {
            msg: '操作成功',
            status: 200
        }
    }
    res.send(data)
}

module.exports = {
    getSetting,
    editSetting,
    addKeyWords
}
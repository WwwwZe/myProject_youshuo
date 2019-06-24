const db = require("../tools/db")
const moment = require("moment")

// 获取菜单
let navmenu = async (req, res) => {
    let data
    const sql = "select * from front_navmenu"
    const result = await db(sql)
    if (typeof result != 'object') {
        data = {
            data: null,
            meta: {
                msg: '获取菜单失败',
                status: 400
            }
        }
        return res.send(data)
    }
    var dt = []
    result.forEach(item => {
        dt.push({
            id: item.nm_id,
            name: item.nm_name,
            path: item.nm_path,
            icon: item.nm_icon,
            ctime: item.nm_ctime
        })
    })
    data = {
        data: dt,
        meta: {
            msg: '获取菜单列表成功',
            status: 200
        }
    }
    res.send(data)
}

// 获取单个菜单
let getNavmenu = async (req, res) => {
    let data
    const id = req.params.id
    const sql = `select * from front_navmenu where nm_id = ?`
    const result = await db(sql, id)
    if (result.length != 1) {
        data = {
            data: null,
            meta: {
                status: 400,
                msg: "获取失败"
            }
        }
        return res.send(data)
    }
    dt = {
        id: result[0].nm_id,
        name: result[0].nm_name,
        path: result[0].nm_path,
        icon: result[0].nm_icon,
        c_time: result[0].nm_ctime
    }
    data = {
        data: dt,
        meta: {
            status: 200,
            msg: "获取成功"
        }
    }
    res.send(data)
}

// 添加菜单
let addNavmenu = async (req, res) => {
    let data
    let sql = `insert into front_navmenu set ?`
    const dt = {
        nm_name: req.body.name,
        nm_icon: req.body.icon,
        nm_path: req.body.path,
        nm_ctime: moment().format("YYYY-MM-DD")
    }
    const result = await db(sql, dt)
    if (result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                status: 400,
                msg: "菜单添加失败"
            }
        }
        return res.send(data)
    }
    console.log(result)
    // dt.nm_id=result
    data = {
        data: dt,
        meta: {
            status: 200,
            msg: "菜单添加成功"
        }
    }
    res.send(data)
}

// 删除菜单
let delNavmenu = async (req, res) => {
    const id = req.params.id
    let data
    const sql = `delete from front_navmenu where nm_id = ?`
    const result = await db(sql, id)
    if (result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                status: 400,
                msg: "删除失败"
            }
        }
        return res.send(data)
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

// 修改菜单
let editNavmenu = async (req, res) => {
    let data
    const id = req.params.id
    const sql = `update front_navmenu set ? where nm_id = ?`
    let dt = {
        nm_name: req.body.name,
        nm_icon: req.body.icon,
        nm_path: req.body.path
    }
    const result = await db(sql, [dt,id])
    if(result.affectedRows!=1) {
        data={
            data:null,
            meta:{
                status:400,
                msg:"修改失败"
            }
        }
        return res.send(data)
    }
    dt = {
        id:id,
        name:req.body.name,
        icon: req.body.icon,
        path:req.body.path
    }
    data={
        data:dt,
        meta:{
            status:200,
            msg:"修改成功"
        }
    }
    res.send(data)
}

module.exports = {
    navmenu,
    getNavmenu,
    addNavmenu,
    delNavmenu,
    editNavmenu
}
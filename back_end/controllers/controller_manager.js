const db = require("../tools/db")
const moment = require("moment")

// 获取管理员列表
let getManager = (req, res) => {
    // console.log(req.query)
    async function eSql() {
        const pagenumF = (req.query.pagenum - 1) * req.query.pagesize
        let sql = `select * from ys_manager order by mg_id limit ${pagenumF},${req.query.pagesize}`
        if (req.query.query != '') {
            sql = `select * from ys_manager where mg_username like '%${req.query.query}%' 
                    order by mg_id limit ${pagenumF},${req.query.pagesize}`
        }
        let data
        const result = await db(sql)
        // console.log(result)
        if (typeof result != 'object') {
            data = {
                data: null,
                meta: {
                    msg: '获取管理员列表失败',
                    status: 400
                }
            }
            return res.send(data)
        }
        sql = `select * from ys_manager where mg_username like '%${req.query.query}%'`
        const resu = await db(sql)
        if (typeof result != 'object') return console.log(resu);
        const total = resu.length
        // console.log(total)
        var dt = []
        result.forEach(item => {
            dt.push({
                id: item.mg_id,
                username: item.mg_username,
                password: item.mg_password,
                email: item.mg_email,
                mobile: item.mg_mobile,
                state: item.mg_state == '1' ? true : false,
                c_time: item.mg_time
            })
        })
        data = {
            data: {
                pagetotal: total,
                pagenum: req.query.pagenum,
                managers: dt
            },
            meta: {
                msg: "获取管理员列表成功!",
                status: 200
            }
        }
        res.send(data)
    }
    eSql()
}

// 根据id查询单个管理员信息
let managerid = async (req, res) => {
    const id = req.params.id
    // console.log(id)
    let data
    let sql = `select * from ys_manager where mg_id = ?`
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
            id: result[0].mg_id,
            username: result[0].mg_username,
            password: result[0].mg_password,
            email: result[0].mg_email,
            mobile: result[0].mg_mobile,
            state: result[0].mg_state == '1' ? true : false,
            c_time: result[0].mg_time
        },
        meta: {
            msg: '获取成功',
            status: 200
        }
    }
    res.send(data)
}

// 添加管理员
let addManager = (req, res) => {
    async function eSql2() {
        let data
        let sql = "select * from ys_manager where mg_username = ?"
        const r1 = await db(sql, req.body.username)
        if (r1.length == 1) {
            data = {
                data: null,
                meta: {
                    msg: '用户名重复,请修改用户名',
                    status: 400
                }
            }
            return res.send(data)
        }

        sql = "select * from ys_manager where mg_email = ?"
        const r2 = await db(sql, req.body.email)
        if (r2.length == 1) {
            data = {
                data: null,
                meta: {
                    msg: '邮箱重复,请修改邮箱',
                    status: 400
                }
            }
            return res.send(data)
        }

        sql = "insert into ys_manager set ?"
        const dt = {
            mg_username: req.body.username,
            mg_password: req.body.password,
            mg_email: req.body.email,
            mg_mobile: req.body.mobile,
            mg_ctime: moment().format("YYYY-MM-DD hh:mm:ss")
        }
        const r3 = await db(sql, dt)
        if (r3.affectedRows != 1 || typeof r3 != 'object') {
            data = {
                data: null,
                meta: {
                    msg: '添加管理员失败',
                    status: 400
                }
            }
            return res.send(data)
        }
        data = {
            data: {
                id: r3.insertId,
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                tel: req.body.tel,
            },
            meta: {
                msg: '添加管理员成功',
                status: 200
            }
        }
        res.send(data)
    }
    eSql2()
}

// 删除管理员
let delManager = (req, res) => {
    async function eSql3() {
        const id = req.params.id
        let data
        const sql = "delete from ys_manager where mg_id = ?"
        const result = await db(sql, id)
        if (typeof result != 'object' || result.affectedRows != 1) {
            data = {
                data: null,
                meta: {
                    msg: '删除管理员失败',
                    status: 400
                }
            }
            return res.send(data)
        }
        data = {
            data: null,
            meta: {
                msg: '删除管理员成功',
                status: 200
            }
        }
        res.send(data)
    }
    eSql3()
}

// 编辑管理员
let editManager = (req, res) => {
    // console.log(req.params.id)
    // console.log(req.body)
    async function eSql4() {
        const id = req.params.id
        const dt = {
            mg_username: req.body.username,
            mg_email: req.body.email,
            mg_mobile: req.body.mobile
        }
        let data
        let sql = `update ys_manager set ? where mg_id = ?`
        const result = await db(sql, [dt, id])
        // console.log(result)
        if (typeof result != 'object' || result.affectedRows != 1) {
            data = {
                data: null,
                meta: {
                    msg: '修改管理员信息失败',
                    status: 400
                }
            }
            return res.send(data)
        }
        dt.u_id = req.params.id
        data = {
            data: dt,
            meta: {
                msg: '修改管理员信息成功',
                status: 200
            }
        }
        res.send(data)
    }
    eSql4()
}

// 更改管理员状态
let managersState = (req, res) => {
    // console.log(req.params)
    async function eSql5() {
        const id = req.params.id
        // console.log(typeof req.params.type)
        const state = req.params.type == 'true' ? '1' : '0'
        const dt = {
            mg_state: state
        }
        // console.log(dt)
        let sql = `update ys_manager set ? where mg_id = ?`
        const result = await db(sql, [dt, id])
        if (typeof result != 'object' || result.affectedRows != 1) {
            data = {
                data: null,
                meta: {
                    msg: '更改管理员状态失败',
                    status: 400
                }
            }
            return res.send(data)
        }
        data = {
            data: null,
            meta: {
                msg: '更改管理员状态成功',
                status: 200
            }
        }
        res.send(data)
    }
    eSql5()
}

// 修改密码
let password = async (req, res) => {
    let data
    const id = req.params.id
    let sql = `select * from ys_manager where mg_id = ? and mg_password = ?`
    const result1 = await db(sql, [id,req.body.oldPassword])
    if (result1.length !=1) {
        data={
            data:null,
            meta:{
                status:401,
                msg:"原密码错误"
            }
        }
        return res.send(data)
    } else if (result1.length==1){
        const dt = {
            mg_password:req.body.newPassword
        }
        sql=`update ys_manager set ? where mg_id = ?`
        const result2 = await db(sql,[dt,id])
        if(result2.affectedRows!=1) {
            data={
                data:null,
                meta:{
                    status:402,
                    msg:"密码修改失败"
                }
            }
            return res.send(data)
        }
        data={
            data:null,
            meta:{
                status:200,
                msg:"密码修改成功"
            }
        }
        res.send(data)
    }
}


module.exports = {
    getManager,
    managerid,
    addManager,
    delManager,
    editManager,
    managersState,
    password
}
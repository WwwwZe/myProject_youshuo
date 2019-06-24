const db = require("../tools/db")
const moment = require("moment")

// 获取用户列表
let getUser = (req, res) => {
    // console.log(req.query)

    async function eSql() {
        const pagenumF = (req.query.pagenum - 1) * req.query.pagesize
        let sql = `select * from ys_user order by u_id limit ${pagenumF},${req.query.pagesize}`
        if (req.query.query != '') {
            sql = `select * from ys_user where u_nickname like '%${req.query.query}%' order by u_id limit ${pagenumF},${req.query.pagesize}`
        }
        let data
        const result = await db(sql)
        // console.log(result)
        if (typeof result != 'object') {
            data = {
                data: null,
                meta: {
                    msg: '获取用户列表失败',
                    status: 400
                }
            }
            return res.send(data)
        }
        sql = `select * from ys_user where u_nickname like '%${req.query.query}%'`
        const resu = await db(sql)
        if (typeof result != 'object') return console.log(resu);
        const total = resu.length
        // console.log(total)
        var dt = []
        result.forEach(item => {
            dt.push({
                id: item.u_id,
                nickname: item.u_nickname,
                name: item.u_name,
                password: item.u_password,
                gender: item.u_gender,
                age: item.u_age,
                email: item.u_email,
                tel: item.u_tel,
                sign: item.u_sign,
                pic: item.u_pic,
                state: item.u_state == '1' ? true : false,
                c_time: item.c_time,
                u_time: item.c_update
            })
        })
        data = {
            data: {
                pagetotal: total,
                pagenum: req.query.pagenum,
                users: dt
            },
            meta: {
                msg: "获取用户列表成功!",
                status: 200
            }
        }
        res.send(data)
    }
    eSql()
}

// 根据id查询单个用户信息
let userid = async (req, res) => {
    const id = req.params.id
    // console.log(id)
    let data
    let sql = `select * from ys_user where u_id = ?`
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
            id: result[0].u_id,
            nickname: result[0].u_nickname,
            name: result[0].u_name,
            password: result[0].u_password,
            gender: result[0].u_gender,
            age: result[0].u_age,
            email: result[0].u_email,
            tel: result[0].u_tel,
            sign: result[0].u_sign,
            pic: result[0].u_pic,
            state: result[0].u_state == '1' ? true : false,
            c_time: result[0].c_time,
            u_time: result[0].c_update
        },
        meta: {
            msg: '获取成功',
            status: 200
        }
    }
    res.send(data)
}

// 添加用户
let addUser = (req, res) => {
    async function eSql2() {
        let data
        let sql = "select * from ys_user where u_nickname = ?"
        const r1 = await db(sql, req.body.nickname)
        if (r1.length == 1) {
            data = {
                data: null,
                meta: {
                    msg: '昵称重复,请修改昵称',
                    status: 400
                }
            }
            return res.send(data)
        }

        sql = "select * from ys_user where u_email = ?"
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

        sql = "insert into ys_user set ?"
        const dt = {
            u_nickname: req.body.nickname,
            u_password: req.body.password,
            u_name: req.body.name,
            u_gender: req.body.gender,
            u_age: req.body.age,
            u_email: req.body.email,
            u_tel: req.body.tel,
            u_sign: req.body.sign,
            c_time: moment().format("YYYY-MM-DD hh:mm:ss")
        }
        const r3 = await db(sql, dt)
        if (r3.affectedRows != 1 || typeof r3 != 'object') {
            data = {
                data: null,
                meta: {
                    msg: '添加用户失败',
                    status: 400
                }
            }
            return res.send(data)
        }
        data = {
            data: {
                nickname: req.body.nickname,
                password: req.body.password,
                name: req.body.name,
                gender: req.body.gender,
                age: req.body.age,
                email: req.body.email,
                tel: req.body.tel,
                sign: req.body.sign,
            },
            meta: {
                msg: '添加用户成功',
                status: 200
            }
        }
        res.send(data)
    }
    eSql2()
}

// 删除用户
let delUser = (req, res) => {
    async function eSql3() {
        const id = req.params.id
        let data
        const sql = "delete from ys_user where u_id = ?"
        const result = await db(sql, id)
        // console.log(result)
        if (typeof result != 'object' || result.affectedRows != 1) {
            data = {
                data: null,
                meta: {
                    msg: '删除用户失败',
                    status: 400
                }
            }
            return res.send(data)
        }
        data = {
            data: null,
            meta: {
                msg: '删除用户成功',
                status: 200
            }
        }
        res.send(data)
    }
    eSql3()
}

// 编辑用户
let editUser = (req, res) => {
    // console.log(req.params.id)
    // console.log(req.body)
    async function eSql4() {
        const id = req.params.id
        const dt = {
            u_name: req.body.name,
            u_gender: req.body.gender,
            u_age: req.body.age,
            u_email: req.body.email,
            u_tel: req.body.tel,
            u_sign: req.body.sign,
            c_update: moment().format("YYYY-MM-DD hh:mm:ss")
        }
        let data
        let sql = `update ys_user set ? where u_id = ?`
        const result = await db(sql, [dt, id])
        // console.log(result)
        if (typeof result != 'object' || result.affectedRows != 1) {
            data = {
                data: null,
                meta: {
                    msg: '修改用户信息失败',
                    status: 400
                }
            }
            return res.send(data)
        }
        dt.u_id = req.params.id
        data = {
            data: dt,
            meta: {
                msg: '修改用户信息成功',
                status: 200
            }
        }
        res.send(data)
    }
    eSql4()
}

// 更改用户状态
let usersState = async (req, res) => {
    // console.log(req.params)
    const id = req.params.id
    // console.log(typeof req.params.type)
    const state = req.params.type == 'true' ? '1' : '0'
    const dt = {
        u_state: state
    }
    // console.log(dt)
    let sql = `update ys_user set ? where u_id = ?`
    const result = await db(sql, [dt, id])
    if (typeof result != 'object' || result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                msg: '更改用户状态失败',
                status: 400
            }
        }
        return res.send(data)
    }
    data = {
        data: null,
        meta: {
            msg: '更改用户状态成功',
            status: 200
        }
    }
    res.send(data)
}

// 修改密码
let editPassword = async (req, res) => {
    const id = req.params.id
    const dt = {
        u_password: req.body.newPassword
    }
    let sql = `update ys_user set ? where u_id = ?`
    const result = await db(sql, [dt, id])
    if (typeof result != 'object' || result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                msg: '更改用户密码失败',
                status: 400
            }
        }
        return res.send(data)
    }
    data = {
        data: null,
        meta: {
            msg: '更改用户密码成功',
            status: 200
        }
    }
    res.send(data)
}

module.exports = {
    getUser,
    userid,
    addUser,
    delUser,
    editUser,
    usersState,
    editPassword
}
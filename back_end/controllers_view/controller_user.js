const db = require("../tools/db")
const moment = require("moment")

// 添加用户
let addUser = async (req, res) => {
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
        u_pic: req.body.picurl,
        u_nickname: req.body.nickname,
        u_password: req.body.password,
        u_name: req.body.name,
        u_gender: req.body.gender,
        // u_age: req.body.age,
        u_email: req.body.email,
        u_tel: req.body.tel,
        u_sign: req.body.sign,
        c_time: moment().format("YYYY-MM-DD")
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

// 修改用户信息
let updateUser = async (req, res) => {
    const id = req.session.userInfo.u_id
    const dt = {
        u_pic: req.body.picurl,
        u_nickname: req.body.nickname,
        u_name: req.body.name,
        u_gender: req.body.gender,
        u_email: req.body.email,
        u_tel: req.body.tel,
        u_sign: req.body.sign,
        c_update: moment().format("YYYY-MM-DD hh:mm:ss")
    }
    let data
    let sql = `update ys_user set ? where u_id = ?`
    const result = await db(sql, [dt, id])
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

// 修改密码
let changePassword = async (req, res) => {
    let data
    const id = req.session.userInfo.u_id
    let sql = `select * from ys_user where u_id = ? and u_password = ?`
    const rst=await db(sql,[id,req.body.oldPassword])
    if(rst.length!=1) {
        data={
            data:null,
            meta:{
                status:401,
                msg:"旧密码错误"
            }
        }
        return res.send(data)
    }
    const dt = {
        u_password:req.body.newPassword
    }
    
    sql = `update ys_user set ? where u_id = ?`
    const result = await db(sql, [dt, id])
    // console.log(result)
    if (typeof result != 'object' || result.affectedRows != 1) {
        data = {
            data: null,
            meta: {
                msg: '修改用户密码失败',
                status: 402
            }
        }
        return res.send(data)
    }
    data = {
        data: dt,
        meta: {
            msg: '修改用户密码成功',
            status: 200
        }
    }
    res.send(data)
    req.session.destroy()
}

module.exports = {
    addUser,
    updateUser,
    changePassword
}
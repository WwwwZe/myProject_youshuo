const db = require("../tools/db")

let userlogin = async (req, res) => {
    const user = req.body.user
    const password = req.body.password
    let data
    const sql = `select * from ys_user where u_nickname = ? and u_password = ?;
                select * from ys_user where u_email = ? and u_password = ?`
    const result = await db(sql, [user, password, user, password])
    // console.log(result)
    if (result[0].length == 1 || result[1].length == 1) {
        data = {
            msg: '登陆成功',
            status: 200
        }
        req.session.isLocation = true
        req.session.userInfo = result[0].length == 1 ? result[0][0] : result[1][0]
        return res.send(data)
    }
    data = {
        msg: '用户名或密码错误',
        status: 400
    }
    res.send(data)
}

let userlogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.send({
            status: 201,
            msg: "退出失败"
        })
        res.send({
            status: 200,
            msg: "退出成功"
        });
    })
}

module.exports = {
    userlogin,
    userlogout
}
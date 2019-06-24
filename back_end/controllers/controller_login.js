// 密匙:1.引入
const jwt = require('jsonwebtoken')
const db = require("../tools/db")

// 登录验证
let login = (req, res) => {
    // console.log(req.body)
    async function eSql() {
        let data
        const sql = "select * from ys_manager where mg_username = ?"
        const result = await db(sql, req.body.username)
        // console.log(result)
        if (result.length != 1 || typeof result != 'object') {
            data = {
                data: null,
                meta: {
                    msg: "用户名错误!",
                    status: 400
                }
            }
            return res.send(data)
        }
        if (result[0].mg_password !== req.body.password) {
            data = {
                data: null,
                meta: {
                    msg: "密码错误!",
                    status: 400
                }
            }
            return res.send(data)
        }
        if (result[0].mg_state == 0) {
            data = {
                data: null,
                meta: {
                    msg: "用户失效!",
                    status: 400
                }
            }
            return res.send(data)
        }
        /** 密匙 2.生成token
         * 调用 jsonwebtoken 的 sign() 方法来生成token
         * 参数1：编码后存储在 token 中的数据，也是验证 token 后可以拿到的数据
         * 参数2：第二个是密钥，自己定义的，验证的时候也是要相同的密钥才能解码
         * 参数3：第三个是options，可以设置 token 的过期时间
         */
        const token = jwt.sign({
            name: result[0].mg_username,
            _id: result[0].mg_id
        }, 'my_token', {
            expiresIn: '24h'
        });
        data = {
            data: {
                id: result[0].mg_id,
                username: result[0].mg_username,
                mobile: result[0].mg_mobile,
                email: result[0].mg_email,
                token: token,
            },
            meta: {
                msg: "登陆成功!",
                status: 200
            }
        }
        res.send(data)
    }
    eSql()
}

module.exports = login
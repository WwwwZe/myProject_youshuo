const path = require('path')
const db = require('../tools/db')

let userInfoUpdatePage = async (req, res) => {
    const sql = `select * from ys_user where u_id = ?`
    const result = await db(sql,req.session.userInfo.u_id)
    const dt = {
        isLocation: req.session.isLocation,
        userInfo: result[0],
    }
    res.render(path.join(rootPath, "view/pages", "userInfoUpdate.html"), dt)
}

module.exports = userInfoUpdatePage
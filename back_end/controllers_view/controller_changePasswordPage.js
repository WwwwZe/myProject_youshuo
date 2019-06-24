const path = require('path')
const db = require('../tools/db')

let changePasswordPage = async (req, res) => {
    const dt = {
        isLocation: req.session.isLocation,
        userInfo: req.session.userInfo,
    }
    if(req.session.userInfo) {
        sql = `select * from ys_user where u_id = ?`
        const rrr = await db(sql,req.session.userInfo.u_id)
        dt.userInfo=rrr[0]
    }
    res.render(path.join(rootPath, "view/pages", "changePassword.html"), dt)
}


module.exports = changePasswordPage
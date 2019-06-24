const path = require('path')
const db = require('../tools/db')

let loginPage = (req, res) => {
    res.render(path.join(rootPath, "view/pages", "login.html"))
}

module.exports = loginPage
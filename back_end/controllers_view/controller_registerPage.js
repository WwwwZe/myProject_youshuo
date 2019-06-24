const path = require('path')
const db = require('../tools/db')

let registerPage = (req, res) => {
    res.render(path.join(rootPath, "view/pages", "register.html"))
}

module.exports = registerPage
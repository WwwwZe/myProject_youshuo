const sql = require("mysql")
// 配置数据库
const conn = sql.createConnection({
    port: "3306",
    user: "root",
    password: "root",
    database: "myproject_youshuo",
    multipleStatements: true
})
conn.connect()

// 防止数据库增删改查回调地狱问题,处理异步操作
function executeSql(sql, args) {
    return new Promise(function (resolve, reject) {
        conn.query(sql, args, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        })
    })
}

module.exports = executeSql
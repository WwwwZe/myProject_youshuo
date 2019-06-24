const db = require("../tools/db")

// 获取菜单列表
let menus = (req, res) => {
    async function eSql() {
        let sql = 'select * from back_menu'
        let data
        const result = await db(sql)
        if (typeof result != 'object') {
            data = {
                data: null,
                meta: {
                    msg: '获取菜单失败',
                    status: 400
                }
            }
            return res.send(data)
        }
        sql = ''
        result.forEach((item, k) => {
            sql += `select * from back_submenu where s_id in (${result[k].s_id});`
        })
        const result2 = await db(sql)
        // data.chidren数据格式转换
        var res2 = []
        result2.forEach((item, k) => {
            var re2 = []
            item.forEach(item2 => {
                var r2 = {}
                r2 = {
                    id: item2.s_id,
                    name: item2.s_name,
                    path: item2.s_path
                }
                re2.push(r2)
            })
            res2.push(re2)
        })
        res2.forEach((item, k) => {
            result[k].children = item
        })
        // console.log(result)
        // data其他数据格式转换
        var dt = []
        result.forEach(item => {
            dt.push({
                id: item.m_id,
                name: item.m_name,
                path: item.m_path,
                icon: item.m_icon,
                children: item.children
            })
        })
        data = {
            data: dt,
            meta: {
                msg: '获取菜单列表成功',
                status: 200
            }
        }
        res.send(data)
    }
    eSql()
}

module.exports = menus

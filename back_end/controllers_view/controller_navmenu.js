const db = require("../tools/db")

let navmenu = async (req, res) => {
    let data
    const sql = "select * from front_navmenu"
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
    var dt = []
    result.forEach(item => {
        dt.push({
            id: item.m_id,
            name: item.nm_name,
            path: item.nm_path,
            icon: item.nm_icon,
            ctime: item.nm_ctime
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

module.exports = navmenu
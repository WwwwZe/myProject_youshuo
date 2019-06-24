const db = require("../tools/db")

// 获取轮播图
let getSlide = async (req, res) => {
    let data
    let sql = "select * from ys_slide"
    const result = await db(sql)
    if (typeof result != 'object') {
        data = {
            data: null,
            meta: {
                msg: "获取地区类型失败",
                status: 400
            }
        }
        return res.send(data)
    }
    var dt = []
    result.forEach(item => {
        dt.push({
            id: item.s_id,
            url: item.s_url,
            text: item.s_text,
            link: item.s_link,
            addtime: item.s_addtime
        })
    })
    data = {
        data: dt,
        meta: {
            msg: "获取地区类型成功",
            status: 200
        }
    }
    res.send(data)
}

module.exports = getSlide
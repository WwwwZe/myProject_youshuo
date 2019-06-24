const express = require("express")
const bp = require("body-parser")
const cors = require('cors')

const app = express()

// 设置跨域请求
app.use(cors({
    origin: ['http://localhost:9524', 'http://127.0.0.1:9524'],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    alloweHeaders: ['Content-Type', 'Authorization']
}));

app.use(bp.urlencoded({
    extended: false
}));

// 启动服务监听
app.listen("484", () => {
    console.log(
        `后台api服务接口运行在:
            http://127.0.0.1:484`)
})

// 显示上传的图片（注册中间件）
app.use("/uploads", express.static("./uploads"));

// 自定义中间件 检测token
const verificationToken = require("./middleware/verificationToken")
app.use(verificationToken)


const router_login = require("./routers/router_login")
app.use(router_login)
const router_menus = require("./routers/router_menus")
app.use(router_menus)
const router_user = require("./routers/router_user")
app.use(router_user)
const router_manager = require("./routers/router_manager")
app.use(router_manager)
const router_article = require("./routers/router_article")
app.use(router_article)
const router_type1 = require("./routers/router_type1")
app.use(router_type1)
const router_type2 = require("./routers/router_type2")
app.use(router_type2)
const router_comment = require("./routers/router_comment")
app.use(router_comment)
const router_upload = require("./routers/router_upload")
app.use(router_upload)
const router_slide = require("./routers/router_slide")
app.use(router_slide)
const router_setting = require("./routers/router_setting")
app.use(router_setting)
const router_navmenu = require("./routers/router_navmenu")
app.use(router_navmenu)
const router_ask = require("./routers/router_ask")
app.use(router_ask)

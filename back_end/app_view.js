const express = require("express")
const bp = require("body-parser")
const template = require("express-art-template")
const session = require("express-session")

const app = express()

app.use(bp.urlencoded({
    extended: false
}));

// 启动服务监听
app.listen("198", () => {
    console.log(
        `前台页面服务接口运行在:
            http://127.0.0.1:198`)
})

// 设置全局路径（当前文件夹路径）
global.rootPath=__dirname;

// 模板引擎注册为中间件
app.engine("html",template)

// 配置session
app.use(session({
    secret:"asfdasffef",
    resave:false,
    saveUninitialized:false
}))

// 静态资源注册为中间件
app.use("/uploads", express.static("./uploads"))
app.use("/assets", express.static("./view/assets"))
app.use("/travels/assets", express.static("./view/assets"))
app.use("/strategy/assets", express.static("./view/assets"))
app.use("/detail/assets", express.static("./view/assets"))
app.use("/answer/assets", express.static("./view/assets"))
app.use("/editArticle/assets", express.static("./view/assets"))
app.use("/searchMore/assets", express.static("./view/assets"))
app.use("/searchMore/travels/assets", express.static("./view/assets"))
app.use("/searchMore/asks/assets", express.static("./view/assets"))

// 检验用户是否登录
const isLogin=require("./middleware/isLogin")
app.use(isLogin)

const router_page=require("./routers_view/router_page")
app.use(router_page)
const router_navmenu = require("./routers_view/router_navmenu")
app.use(router_navmenu)
const router_slide = require("./routers_view/router_slide")
app.use(router_slide)
const router_userlogin = require("./routers_view/router_userlogin")
app.use(router_userlogin)
const router_upload = require("./routers_view/router_upload")
app.use(router_upload)
const router_user = require("./routers_view/router_user")
app.use(router_user)
const router_comment = require("./routers_view/router_comment")
app.use(router_comment)
const router_askcomment = require("./routers_view/router_askcomment")
app.use(router_askcomment)
const router_article = require("./routers_view/router_article")
app.use(router_article)
const router_newquestion = require("./routers_view/router_newquestion")
app.use(router_newquestion)


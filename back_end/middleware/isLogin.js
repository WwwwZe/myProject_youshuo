const url = require("url");

const isLogin = (req, res, next) => {
    let urlObj = url.parse(req.url)
    const checkLoginUrls = ["/member", "/addarticle", "/newquestion", "/userInfoUpdate", "/editArticle","/changePassword"]
    if (urlObj.pathname.split("/").length == 3) {
        var arr = urlObj.pathname.split("/")
        var urlPath = "/" + arr[1]
        if (checkLoginUrls.includes(urlPath)) {
            if (!req.session.isLocation) {
                return res.redirect("/login")
            }

        }
    }
    if (checkLoginUrls.includes(urlObj.pathname)) {
        if (!req.session.isLocation) {
            return res.redirect("/login")
        }

    }
    next()
}

module.exports = isLogin
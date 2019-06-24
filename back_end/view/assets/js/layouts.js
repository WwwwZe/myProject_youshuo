$(function () {
    $(".logout").click(function () {
        var index = layer.confirm("是否退出登录?", {
            btn: ["退出", "点错了..."],
            title: "退出登录"
        }, function () {
            layer.close(index);
            $.get("/userlogout")
            window.location.href = "/index"
        }, function () {
            layer.close(index);
        })
    })
})
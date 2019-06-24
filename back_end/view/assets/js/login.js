$(function () {
    var SlideVerifyPlug = window.slideVerifyPlug;
    var slideVerify = new SlideVerifyPlug('#verify-wrap', {
        wrapWidth: '320',
        initText: '请按住滑块，拖动到最右',
        sucessText: '校验成功，通过',
        getSuccessState: function (res) {
            console.log(res);
        }
    });

    $(".login").click(function () {
        if (!slideVerify.slideFinishState) return layer.msg("请拖动滑块进行验证", {
            icon: 7
        });
            if ($(".user input").val().trim() == "" || $(".password input").val().trim() == "") {
                return layer.msg("用户名/密码不能为空", {
                    icon: 7
                })
            }
        var user = $(".user input").val()
        var password = $(".password input").val()
        $.post("/userlogin", {
            user: user,
            password: password
        }, function (dt) {
            if (dt.status != 200) {
                slideVerify.resetVerify();
                return layer.msg(dt.msg, {
                    icon: 2
                });
            }
            window.location.href = "/index"
        })
    })
})
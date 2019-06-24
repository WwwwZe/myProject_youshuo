$(function () {
    template.defaults.rules[1].test = /{\(([@#]?)[ \t]*(\/?)([\w\W]*?)[ \t]*\)}/;
    // 获取导航栏菜单
    $.get("/navmenu", function (dt) {
        var navmenuStr = template("navmenuM", {
            navmenu: dt.data,
            num: 4
        })
        $(".navmenu").html(navmenuStr)
    })

    $('#passwordForm').validate({
        rules: {
            oldPassword: {
                required: true
            },
            newPassword: {
                required: true,
                rangelength: [3, 12],
                isEqual: true
            },
            rePassword: {
                equalTo:"#newPassword"
            },
        },
        messages: {
            oldPassword: {
                required: "请填写旧密码"
            },
            newPassword: {
                required: "请填写新密码",
                rangelength: "长度为3-12位",
            },
            rePassword: {
                equalTo:"俩次密码输入不一致"
            },
        },
        submitHandler: function () {
           $.post("/changePassword",$("#passwordForm").serialize(),function(dt){
               console.log(dt)
               if(dt.meta.status!=200) return layer.msg(dt.meta.msg);
               layer.msg(dt.meta.msg)
               window.location.href="/login"
           })
        }
    })
    $.validator.addMethod("isEqual", function (value, element) {
        var old=$("#oldPassword").val()
        return this.optional(element) || (value != old);
    }, "新密码与旧密码相同");
})
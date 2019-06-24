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

    $("#avatar").change(function () {
        var fileObj = this.files[0];
        var fd = new FormData();
        fd.append("pic", fileObj);
        $.ajax({
            url: "/upload",
            type: "post",
            data: fd,
            dataType: "json",
            contentType: false,
            processData: false,
            success: function (dt) {
                $(".show").html(`<img src="${dt.data.path}">`);
                $(".picurl").val(dt.data.path);
            }
        })
    })

    $('#updateUserForm').validate({
        rules: {
            picurl: {
                required: true
            },
            email: {
                required: true,
                email: true,
            },
            nickname: {
                required: true,
                rangelength: [2, 8],
                isNickname: true
            },
            tel: {
                isPhoneNum: true
            }
        },
        messages: {
            picurl: {
                required: '请选择头像',
            },
            email: {
                required: '邮箱必填',
                email: '请输入正确的邮箱格式'
            },
            nickname: {
                required: '昵称必填',
                rangelength: '昵称在2-8位字符之间'
            }
        },
        submitHandler: function () {
            $.post("/updateUser", $("#updateUserForm").serialize(), function (dt) {
                if(dt.meta.status!=200) return layer.msg(dt.meta.msg);
                window.location.href = "/member"
            })
        }
    })
    $.validator.addMethod("isPhoneNum", function (value, element) {
        var length = value.length;
        var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
        return this.optional(element) || (length == 11 && mobile.test(value));
    }, "请正确填写您的手机号码");
    $.validator.addMethod("isNickname", function (value, element) {
        var nickname = /^\w+$/;
        return this.optional(element) || (nickname.test(value));
    }, "昵称为英文数字(包括_)");

    $(".reset").click(function () {
        $("#updateUserForm")[0].reset()
    })
})
$(function () {
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

    $('#registerForm').validate({
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
            password: {
                required: true,
                rangelength: [3, 12],
            },
            repassword: {
                equalTo: '#password'
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
            },
            password: {
                required: '密码必填',
                rangelength: '密码要在3-12位之间',
            },
            repassword: {
                equalTo: '两次密码输入不一致'
            }
        },
        submitHandler: function () {
            $.post("/addUser",$("#registerForm").serialize(),function(dt){
                if(dt.meta.status!=200) return layer.msg(dt.meta.msg)
                window.location.href="/login"
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
        return this.optional(element) || ( nickname.test(value));
    }, "昵称为英文数字(包括_)");

    $(".reset").click(function(){
        $("#registerForm")[0].reset()
    })
})
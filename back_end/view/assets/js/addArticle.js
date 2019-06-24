$(function () {
    template.defaults.rules[1].test = /{\(([@#]?)[ \t]*(\/?)([\w\W]*?)[ \t]*\)}/;
    // 获取导航栏菜单
    $.get("/navmenu", function (dt) {
        var navmenuStr = template("navmenuM", {
            navmenu: dt.data,
            num: 1
        })
        $(".navmenu").html(navmenuStr)
    })
    // 定义富文本框
    var um = UM.getEditor('content', {
        initialFrameWidth: 845,
        initialFrameHeight: 300
    });

    $("#img").change(function () {
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

    $(".addarticle").click(function(){
        var params=$(".addarticleForm").serialize()
        $.post("/addArticle",params,function(dt){
            if(dt.meta.status!=200){
                return layer.msg(dt.meta.msg)
            }
            window.location.href="/member"
        })
    })

    // 返回顶部
    $(window).scroll(function(){
        var top = $(window).scrollTop()
        if(top >= 500) {
            $(".backTop").fadeIn()
        }else {
            $(".backTop").fadeOut()
        }
    })
    $(".backTop").click(function(){
        $("html,body").animate({scrollTop:0},500);
    })
})
$(function () {
    template.defaults.rules[1].test = /{\(([@#]?)[ \t]*(\/?)([\w\W]*?)[ \t]*\)}/;
    // 获取导航栏菜单
    $.get("/navmenu", function (dt) {
        var navmenuStr = template("navmenuM", {
            navmenu: dt.data,
            num: 2
        })
        $(".navmenu").html(navmenuStr)
    })
    $(".addnewquestion").click(function(){
        if($("#title").val().trim().length==0) return layer.msg("标题不能为空");
        $.post("/addNewquestion",$(".newquestionForm").serialize(),function(dt){
            if(dt.meta.status!=200) return layer.msg(dt.meta.msg)
            window.location.href="/asks"
        })
    })
})
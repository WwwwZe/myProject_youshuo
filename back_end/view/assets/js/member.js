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

    $(".travels").on("click", "h3", function () {
        var index = $(this).index()
        $(this).addClass("active").siblings().removeAttr("class")
        if (index == 0) {
            $(".list1").show()
            $(".list2").hide()
        } else if (index == 1) {
            $(".list1").hide()
            $(".list2").show()
        }
    })

    $(".delArticle").click(function () {
        var _this = this
        var id = $(this).attr("articleid")
        var index = layer.confirm("是否删除该篇游记?", {
            btn: ["删除", "点错了..."],
            title: "删除游记"
        }, function () {
            layer.close(index);
            $.get(`/delArticle/${id}`, function (dt) {
                if (dt.meta.status != 200) return layer.msg(dt.meta.msg);
                $(_this).parents("tr").remove()
                layer.msg(dt.meta.msg)
            })
        }, function () {
            layer.close(index);
        })
    })

    $(".delAsk").click(function () {
        var _this = this
        var id = $(this).attr("askid")
        var index = layer.confirm("是否删除该问题?", {
            btn: ["删除", "点错了..."],
            title: "删除问题"
        }, function () {
            layer.close(index);
            $.get(`/delAsk/${id}`, function (dt) {
                if (dt.meta.status != 200) return layer.msg(dt.meta.msg);
                $(_this).parents("tr").remove()
                layer.msg(dt.meta.msg)
            })
        }, function () {
            layer.close(index);
        })
    })
})
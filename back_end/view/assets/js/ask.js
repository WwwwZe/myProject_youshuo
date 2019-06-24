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

    // 搜索
    $(".search input").on("input", function () {
        if ($(".search input").val().trim().length == 0) {
            $(".searchList").hide()
        }
        $(".searchList ul").html("")
        var tempArr = []
        const query = $(this).val().trim()
        $.get("/searchAsk", {
            query: query
        }, function (dt) {
            dt.data.forEach(function (item) {
                tempArr.push(item)
            })
            tempArr.forEach(function (item) {
                $(".searchList ul").append(`<li><a href="/answer/${item.ask_id}">${item.ask_title}</a></li>`)
            })
            if ($(".searchList li").length == 0) {
                $(".searchList").hide()
            } else {
                $(".searchList").show()
            }
        })
    })

    $(".search .searchbtn").click(function () {
        var query = $(".search input").val()
        window.location.href = `/searchMore/asks/${query}`
    })

    // 分页
    $.ajax({
        url: "/askPageTotal",
        data: {
            pageSize: 5
        },
        type: "get",
        dataType: "json",
        success: function (dt) {
            if(dt.data.pageNum==0){dt.data.pageNum=1}
            window.pagObj = $('.pagination').twbsPagination({
                totalPages: dt.data.pageNum,
                visiblePages: 3,
                first: '',
                prev: '上一页',
                next: '下一页',
                last: '',
                loop: true,
                onPageClick: function (event, page) {
                    $.ajax({
                        url: "/getAskPageContent",
                        type: "get",
                        data: {
                            pageNum: page,
                            pageSize: 5
                        },
                        dataType: "json",
                        success: function (dt) {
                            var str = template("pagelist", {
                                asks: dt.data
                            });
                            $(".list").html(str);
                        }
                    })
                }
            });
        }
    })
})
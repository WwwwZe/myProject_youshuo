$(function () {
    template.defaults.rules[1].test = /{\(([@#]?)[ \t]*(\/?)([\w\W]*?)[ \t]*\)}/;
    // 获取导航栏菜单
    $.get("/navmenu", function (dt) {
        var navmenuStr = template("navmenuM", {
            navmenu: dt.data,
            num: 3
        })
        $(".navmenu").html(navmenuStr)
    })

    // 搜索
    $(".searchbar input").on("input", function () {
        if ($(".searchbar input").val().trim().length == 0) {
            $(".searchList").hide()
        }
        $(".searchList ul").html("")
        var tempArr = []
        const query = $(this).val().trim()
        $.get("/searchArticle", {
            query: query
        }, function (dt) {
            dt.data.forEach(function (item) {
                tempArr.push(item)
            })
            tempArr.forEach(function (item) {
                $(".searchList ul").append(`<li><a href="/detail/${item.a_id}">${item.a_title}</a></li>`)
            })
            if ($(".searchList li").length == 0) {
                $(".searchList").hide()
            } else {
                $(".searchList").show()
            }
        })
    })

    $(".searchbar button").click(function () {
        var query = $(".searchbar input").val()
        window.location.href = `/searchMore/travels/${query}`
    })

    // 分页
    var urlArr=window.location.pathname.split("/")
    var params
    if(urlArr.length==3) {
        params={pageSize:5,type:'type2',id:urlArr[urlArr.length-1]}
    }else {
        params={pageSize:5}
    }
    $.get("/pageTotal",params,function(dt){
        window.pagObj = $('.pagination').twbsPagination({
            totalPages: dt.data.pageNum,
            visiblePages: 3,
            first: '第一页',
            prev: '上一页',
            next: '下一页',
            last: '最后一页',
            loop: true,
            onPageClick: function (event, page) {
              $.ajax({ 
                url:"/getPageContent",
                type:"get",
                data: urlArr.length==3?{pageNum:page,pageSize:5,type:'type2',id:urlArr[urlArr.length-1]}:{pageNum:page,pageSize:5},
                dataType:"json",
                success:function(dt){
                  var str=template("pagelist",{article:dt.data});
                  $(".list_content").html(str);
                }
              })
            }
          });
    })
})
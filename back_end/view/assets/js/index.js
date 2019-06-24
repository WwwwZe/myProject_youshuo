$(function () {
    template.defaults.rules[1].test = /{\(([@#]?)[ \t]*(\/?)([\w\W]*?)[ \t]*\)}/;
    // 获取导航栏菜单
    $.get("/navmenu", function (dt) {
        var navmenuStr = template("navmenuM", {
            navmenu: dt.data,
            num: 0
        })
        $(".navmenu").html(navmenuStr)
    })
    // 设置轮播图
    $.get("/getSlide", function (dt) {
        var slideListStr = template("slideList", {
            slideList: dt.data
        })
        $(".slideList").html(slideListStr)
        dt.data.forEach(function () {
            $(".circle").append("<span></span>")
        })
        var slideIndex = 0
        $($(".slideList li")[slideIndex]).show()
        $($(".circle span")[slideIndex]).addClass("active")
        var IntervalId

        function interval() {
            IntervalId = setInterval(function () {
                slideIndex++;
                if (slideIndex == dt.data.length) {
                    slideIndex = 0
                }
                $($(".slideList li")[slideIndex]).fadeIn().siblings().fadeOut()
                $($(".circle span")[slideIndex]).addClass("active").siblings().removeAttr("class")
            }, 3000)
        }
        interval()
        $(".circle").on("mouseover", "span", function () {
            $(this).addClass("active").siblings().removeAttr("class")
            slideIndex = $(this).index()
            $($(".slideList li")[slideIndex]).fadeIn().siblings().fadeOut()
        })
        $(".slideList").mouseenter(function () {
            clearInterval(IntervalId)
        }).mouseleave(function () {
            interval()
        });
    })
    // 搜索
    $(".search input").on("input", function () {
        if ($(".search input").val().trim().length == 0) {
            $(".searchList").hide()
        }
        $(".searchList ul").html("")
        var tempArr1 = []
        var tempArr2 = []
        const query = $(this).val().trim()
        $.get("/searchArticle", {
            query: query
        }, function (dt) {
            dt.data.forEach(function (item) {
                tempArr1.push(item)
            })
            tempArr1.forEach(function (item) {
                $(".searchList ul").append(`<li><a href="/detail/${item.a_id}">[游记]${item.a_title}</a></li>`)
            })
            if ($(".searchList li").length == 0) {
                $(".searchList").hide()
            } else {
                $(".searchList").show()
            }
        })
        $.get("/searchAsk", {
            query: query
        }, function (dt) {
            dt.data.forEach(function (item) {
                tempArr2.push(item)
            })
            tempArr2.forEach(function (item) {
                $(".searchList ul").append(`<li><a href="/answer/${item.ask_id}">[问答]${item.ask_title}</a></li>`)
            })
            if ($(".searchList li").length == 0) {
                $(".searchList").hide()
            } else {
                $(".searchList").show()
            }
        })
    })

    $(".search .btn").click(function(){
        var query = $(".search input").val()
        // console.log(query)
        window.location.href=`/searchMore/travels/${query}`
    })

})
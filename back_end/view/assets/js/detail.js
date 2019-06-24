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
    $(".textarea textarea").on("input", function () {
        $(".fontNum").html($(this).val().length + "/500")
    })
    $(".addComment").click(function () {
        var hrefArr = window.location.href.split("/")
        var id = hrefArr[hrefArr.length - 1]
        var params = {
            id: id,
            content: $(".textarea textarea").val()
        }
        $.post("/addComment", params, function (dt) {
            // console.log(dt.data)
            if (dt.meta.status != 200) {
                var div = `
                    <div class="form-box">
                        <h2>游说账号登录</h2>
                        <div class="user">
                            <input type="text" placeholder="用户名 / 邮箱">
                        </div>
                        <div class="password">
                            <input type="password" placeholder="登录密码">
                        </div>
                        <a href="javascript:;" class="login">登 录</a>
                        <br>
                        <a href="/register" target="_blank"  class="reset">免 费 注 册</a>
                    </div>`
                return layer.ready(function () {
                    layer.open({
                        type: 1,
                        title: '登录',
                        shadeClose: true,
                        area: ['450px', '410px'],
                        content: div,
                        closeBtn: 0,
                    });
                });
            }
            if ($(".textarea textarea").val().trim() == "") return layer.msg("评论内容不能为空")
            // console.log(dt)
            var str = `
                    <div class="item">
                        <div class="pic">
                            <img src="${dt.data.u_pic?dt.data.u_pic:'/assets/images/user_default.png'}">
                        </div>
                        <div class="txt">
                            <div class="username">${dt.data.u_nickname}</div>
                            <p class="content">
                                ${dt.data.cmt_content}
                            </p>
                            <div class="time">发表于<span>${dt.data.cmt_addtime}</span></div>
                        </div>
                    </div>`
            $(".list").prepend(str)
            $(".textarea textarea").val("")
            layer.msg("评论添加成功")
            // window.location.reload()
        })
    })

    // 弹框登录
    $("body").on("click", ".login", function () {
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
                return layer.msg(dt.msg, {
                    icon: 2
                });
            }
            window.location.reload()
        })
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

    // 分页
    var urlArr=window.location.pathname.split("/")
    var id = urlArr[urlArr.length-1]
    $.ajax({
        url: "/commentPageTotal",
        data: {
            pageSize: 5,
            id:id
        },
        type: "get",
        dataType: "json",
        success: function (dt) {
            if(dt.data.pageNum==0){dt.data.pageNum=1}
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
                        url: "/getCommentPageContent",
                        type: "get",
                        data: {
                            pageNum: page,
                            pageSize: 5,
                            id:id
                        },
                        dataType: "json",
                        success: function (dt) {
                            var str = template("pagelist", {
                                comment: dt.data
                            });
                            $(".list").html(str);
                        }
                    })
                }
            });
        }
    })

    // 返回顶部
    $(window).scroll(function(){
        var top = $(window).scrollTop()
        // var viewHeight = document.documentElement.clientHeight
        if(top >= 300) {
            // $(".backTop").css("display","block")
            $(".backTop").fadeIn()
        }else {
            // $(".backTop").css("display","none")
            $(".backTop").fadeOut()
        }
    })
    $(".backTop").click(function(){
        $("html,body").animate({scrollTop:0},500);
    })
})
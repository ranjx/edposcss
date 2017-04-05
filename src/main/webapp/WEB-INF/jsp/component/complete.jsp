<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.edpos.common.constant.GlobalConstant" %>
<!DOCTYPE html>
<html>
<head>
    <title>${title}－<%=GlobalConstant.PLATFORM_TITLE%></title>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
    <meta http-equiv="Cache-Control" content="no-transform" />
    <meta name="renderer" content="webkit" />
    <meta name="description"   content="<%=GlobalConstant.PLATFORM_DESCRIPTION%>"/>
    <meta name="keywords" content="<%=GlobalConstant.PLATFORM_KEYWORKS%>"/>
    <link href="/assets/image/index/logo.png" rel="image_src" type="image/jpeg">
    <link rel="icon" href="/favicon.ico">
    <link rel="stylesheet" href="/assets/css/reset.css"/>
    <link rel="stylesheet" href="/assets/css/index.css?t=2016"/>
    <link rel="stylesheet" href="/assets/css/iconfont.css?t=2016"/>
    <script>
        !function () {
            function a() {
                var clientWidth = document.documentElement.clientWidth;
                clientWidth <= 800
                        ? document.documentElement.style.fontSize = (clientWidth / 20) + 'px'
                        : document.documentElement.style.fontSize = 16 + 'px';
            }
            var b = null;
            window.addEventListener("resize", function () {
                clearTimeout(b);
                b = setTimeout(a, 300)
            }, !1);
            a();
        }(window);
    </script>
    <script type="text/javascript" src="/assets/js/common/jquery-1.11.3.js"></script>
    <script type="text/javascript" src="/assets/js/common/jquery-wk-common.js"></script>
    <script type="text/javascript" src="/assets/js/common/jquery-plug.js"></script>
    <script type="text/javascript" src="/assets/js/common/jquery.validate.min.js"></script>
    <script type="text/javascript" src="/assets/js/common/passwordStrength.js"></script>

</head>

<body style="background: #f6f6f6;">
<!--[if lt IE 9]>
<div class="please-update-ur-browser">
    <div class="notification">
        <div class="download-wrap">
            <img class="download-icon" src="/assets/image/index/chrome_icon.jpg" alt="Chrome"/>
            <a class="download-link" href="https://www.baidu.com/s?wd=chrome&rsv_spt=1&issp=1&f=8&rsv_bp=1&rsv_idx=2&ie=utf-8&tn=93772186_hao_pg&rsv_enter=1&inputT=355" target="_blank">下载谷歌浏览器</a>
        </div>
    </div>
</div>
<![endif]-->
<header id="top" class="clearfix">
    <div class="top">
        <div class="logo">
            <a href="/">
                <img src="/assets/image/G-Talking.png"/>
            </a>
        </div>
    </div>
</header>

<div class="reg-main register-main" id="register">
    <div class="firstline clearfix">
        <div class="title">免费注册<%=GlobalConstant.PLATFORM_NAME%></div>
        <div class="regtip">
            已有<%=GlobalConstant.PLATFORM_NAME%>账户？<a href="/login">立即登录>></a>
        </div>
    </div>
    <div class="reg-content reg-content-reg clearfix">
        <div class="reg-middle reg-form no-third-party" style="padding-top: 60px">

            <div class="field-container clearfix">
                <p style="color:#51b133"><i class="iconfont icon-check"></i>${message}</p>
            </div>
            <div class="field-container clearfix" style="padding-top: 20px">
                <span style="font-size: 12px" id="timer">5</span><span style="font-size: 12px">秒钟后将自动跳转至${forward}页面，您也可以</span>
                <a href="${forwardUrl}" id="J_SubmitBtn" class="submit-btn">立即${forward}</a>
            </div>
        </div>

    </div>
</div>

</body>
<script>
    var forwardUrl = '${forwardUrl}';
</script>
<script type="text/javascript" src="/assets/js/app/common.js"></script>
<script type="text/javascript" src="/assets/js/app/complete.js"></script>
</html>

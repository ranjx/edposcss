<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.edpos.common.constant.GlobalConstant" %>
<!DOCTYPE html>
<html>
<head>
    <title>登录－<%=GlobalConstant.PLATFORM_TITLE%></title>
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
    <link rel="stylesheet" href="/assets/plugin/layerui/css/layui.css">
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
    <script type="text/javascript" src="/assets/plugin/layerui/layui.js"></script>

</head>

<body>
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
            <h1>
                <a href="#" class="logo-img"><%=GlobalConstant.PLATFORM_NAME%></a>
            </h1>
        </div>
    </div>
</header>

<div class="reg-main register-main" id="login">
    <div class="firstline clearfix">
        <div class="title">登录<%=GlobalConstant.PLATFORM_NAME%>-客服</div>
    </div>
    <div class="reg-content reg-content-reg clearfix">
        <div class="reg-left reg-form no-third-party" style="padding-top: 50px">
            <form id="loginForm">
                <div class="error-tips" style="display:none;"></div>
                <input id="domain" name="domain" type="hidden" value="ccs">
                <div class="field-container">
                    <input id="account"   tabindex="1" class="field" name="account" type="text" data-placeholder="请输入手机号" placeholder="请输入手机号" value="">

                    <div class="clear"></div>
                </div>
                <div class="field-container">
                    <input id="password"   tabindex="2" class="field" name="password" type="password" data-placeholder="请输入密码" placeholder="请输入密码" value="">

                    <div class="clear"></div>
                </div>
                <div class="field-container">
                    <input class="field" tabindex="3" name="code" id="code"
                           style="float:left;width:70px;padding-right:30px;" type="text"
                           data-placeholder="验证码" placeholder="验证码"/>
                    <img style="float:left;cursor: pointer;border: 1px solid #ddd;margin-left: 10px;"
                         src="/captcha" id="J_captcha" title="点击刷新验证码" border="0" height="30"/>
                    <div class="clear"></div>
                </div>
                <div class="submit-container">
                    <a href="javascript:void(0);" id="loginBtn" class="submit-btn">立即登录</a>
                    <a href="/findpassword" style="font-size:12px;color:#f29c33;text-decoration:underline;vertical-align:middle;margin-left: 5px;">忘记密码?</a>
                </div>
            </form>
        </div>

    </div>
</div>

</body>
<script type="text/javascript" src="/assets/js/app/validator.js"></script>
<script type="text/javascript" src="/assets/js/app/common.js"></script>
<script type="text/javascript" src="/assets/js/app/login.js"></script>
</html>
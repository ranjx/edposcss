<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.edpos.common.constant.GlobalConstant" %>
<!DOCTYPE html>
<html>
<head>
    <title>找回密码－<%=GlobalConstant.PLATFORM_TITLE%></title>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
    <meta http-equiv="Cache-Control" content="no-transform" />
    <meta name="renderer" content="webkit" />
    <meta name="description"   content="<%=GlobalConstant.PLATFORM_DESCRIPTION%>"/>
    <meta name="keywords" content="<%=GlobalConstant.PLATFORM_KEYWORKS%>"/>
    <link href="/assets/image/index/logo.png" rel="image_src" type="image/jpeg">
    <link rel="icon" href="/favicon.ico">
    <link rel="stylesheet" href="assets/css/reset.css"/>
    <link rel="stylesheet" href="assets/css/index.css?t=2016"/>
    <link rel="stylesheet" href="assets/css/iconfont.css?t=2016"/>

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
                <a href="/index" class="logo-img"><%=GlobalConstant.PLATFORM_NAME%></a>
            </h1>
        </div>
    </div>
</header>

<div class="reg-main register-main" id="login">
    <div class="firstline clearfix">
        <div class="title">重置密码</div>
    </div>
    <div class="reg-content reg-content-reg clearfix">
        <div class="reg-left reg-form no-third-party" style="padding-top: 50px">
            <form id="resetPwdForm">
                <div class="error-tips" style="display:none;">
                </div>
                <div class="field-container">
                    <input tabindex="1" class="field" name="account" id="account" type="text" data-placeholder="请输入手机号" placeholder="请输入手机号" value="">
                    <div class="clear"></div>
                </div>
                <div class="field-container">
                    <input class="field" tabindex="2" name="code" id="code"
                           style="float:left;width:70px;padding-right:30px;" type="text"
                           data-placeholder="短信验证码" placeholder="短信验证码"/>
                    <!--<img style="float:left;cursor: pointer;border: 1px solid #ddd;margin-left: 10px;"
                         src="/captcha" id="J_captcha" title="点击刷新验证码" border="0" height="30"/>-->
                    <a href="javascript:void(0);" class="submit-btn " disabled="disabled" id="smsCodeSendBtn" style="margin-left: 10px">获取验证码<span class="timer" style="display: none;">(<span class="seconds">0</span>)</span></a>
                    <p class="field-tips">&nbsp;</p>
                    <div class="clear"></div>
                </div>
                <div class="field-container">
                    <input tabindex="3" class="field" name="password" id="password" type="password" placeholder="请输入密码，由6-16位数字英文组成"/>
                </div>
                <div class="field-container">
                    <input tabindex="4" class="field" name="repeatPassword" id="repeatPassword" type="password" placeholder="请再次输入密码，由6-16位数字英文组成"/>
                </div>
                <div class="submit-container">
                    <a href="javascript:void(0);" id="resetPwdBtn" class="submit-btn">修改密码</a>
                    <a href="/login" style="font-size:12px;color:#f29c33;text-decoration:underline;vertical-align:middle;margin-left: 5px;">返回登录</a>
                </div>
            </form>
        </div>

    </div>
</div>

</body>
<jsp:include page="../frame/js.jsp"></jsp:include>
<script type="text/javascript" src="/assets/js/app/validator.js"></script>
<script type="text/javascript" src="/assets/js/app/findpassword.js"></script>
</html>

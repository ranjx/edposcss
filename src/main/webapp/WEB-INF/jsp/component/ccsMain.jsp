<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.edpos.common.constant.GlobalConstant" %>
<!DOCTYPE html>
<html>
<head>
    <title>客服后台－<%=GlobalConstant.PLATFORM_TITLE%></title>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
    <meta http-equiv="Cache-Control" content="no-transform" />
    <meta name="renderer" content="webkit" />
    <meta name="description"   content="<%=GlobalConstant.PLATFORM_DESCRIPTION%>"/>
    <meta name="keywords" content="<%=GlobalConstant.PLATFORM_KEYWORKS%>"/>

    <jsp:include page="../frame/head.jsp"></jsp:include>
    <jsp:include page="../frame/css.jsp"></jsp:include>
</head>
<body>
<div id="bd">
    <div class="main-wrap-bk-css clearfix">
        <jsp:include page="../frame/menu.jsp"></jsp:include>
        <iframe id="indexTab" src="" class="bd-content-wrap"></iframe>
    </div>
</div>
</body>
</html>

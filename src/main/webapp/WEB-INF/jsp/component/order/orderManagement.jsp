<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.edpos.common.constant.GlobalConstant" %>
<!DOCTYPE html>
<html>
<head>
    <title>订单管理－<%=GlobalConstant.PLATFORM_TITLE%></title>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
    <meta http-equiv="Cache-Control" content="no-transform" />
    <meta name="renderer" content="webkit" />
    <meta name="description"   content="<%=GlobalConstant.PLATFORM_DESCRIPTION%>"/>
    <meta name="keywords" content="<%=GlobalConstant.PLATFORM_KEYWORKS%>"/>

    <jsp:include page="../../frame/css.jsp"></jsp:include>
</head>

<body>
<div class="bd-content" style="padding-left: 5px;">
    <div class="title-left-line">订单管理</div>
    <div class="title-bottom-line"></div>
    <div class="wrapper">
        <div class="row">
            <div class="col-lg-11 col-md-11">
                <table id="ccsOrderDataTable" class="bootstrapTbl" data-mobile-responsive="true"></table>
            </div>
        </div>
    </div>
</div>
<!-- 全局js -->
<jsp:include page="../../frame/js.jsp"></jsp:include>
<script src="/assets/js/app/order/orderManagement.js?t=1"></script>
</body>
</html>

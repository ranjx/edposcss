<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.edpos.common.constant.GlobalConstant" %>
<!DOCTYPE html>
<html>
<head>
    <title>代理商管理－<%=GlobalConstant.PLATFORM_TITLE%></title>
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
    <div class="title-left-line">代理商管理</div>
    <div class="title-bottom-line"></div>
    <div class="wrapper">
        <div class="row">
            <div class="col-lg-11 col-md-11">
                <div class="btn-group" id="angentToolbar">
                    <button class="layui-btn" id="btnAdd">
                        <i class="layui-icon">&#xe608;</i> 添加
                    </button>
                </div>
                <table id="angentDataTable" class="bootstrapTbl" data-mobile-responsive="true"></table>
            </div>
        </div>
    </div>
</div>
<!-- 全局js -->
<jsp:include page="../../frame/js.jsp"></jsp:include>
<script src="/assets/js/app/angent/angentUserManagement.js?t=1"></script>
</body>
<script id="angentUserTpl" type="text/html">

    <div style="padding-top: 10px; margin-right: 50px;height: 300px;">
        <form class="layui-form" id="form">
            <div class="layui-form-item">
                <label class="layui-form-label">手机号码</label>
                <div class="layui-input-block">
                    <input type="text" name="account" id="account" value="{{setValue(d.mobile)}}"  required lay-verify="phone" placeholder="请填写代理商登录手机号码" autocomplete="off" class="layui-input" >
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">登录秘密</label>
                <div class="layui-input-block">
                    <input type="password" name="password" id="password" value="{{setValue(d.mobile)}}"  required lay-verify="required" placeholder="请填写代理商登录密码" autocomplete="off" class="layui-input" >
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">企业名称</label>
                <div class="layui-input-block">
                    <input type="text" name="companyName" id="companyName" value="{{setValue(d.companyName)}}" required lay-verify="required" placeholder="请填写企业名称"  autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">代理商姓名</label>
                <div class="layui-input-block">
                    <input type="text" name="userName" id="userName" value="{{setValue(d.customerName)}}" required lay-verify="required" placeholder="请填写代理商姓名" autocomplete="off" class="layui-input" >
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">代理商邮箱</label>
                <div class="layui-input-block">
                    <input type="text" name="email" id="email" value="{{setValue(d.email)}}"  placeholder="请填写代理商邮箱" autocomplete="off" class="layui-input" >
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">联系电话</label>
                <div class="layui-input-block">
                    <input type="text" name="tel" id="tel" value="{{setValue(d.tel)}}" placeholder="请填写联系电话" autocomplete="off" class="layui-input" >
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">企业地址</label>
                <div class="layui-input-block">
                    <input type="text" name="companyAddress" id="companyAddress" value="{{setValue(d.companyAddress)}}" placeholder="请填写企业地址" autocomplete="off" class="layui-input" >
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-input-block">
                    <button class="layui-btn" lay-submit lay-filter="angentUserForm">立即提交</button>
                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                </div>
            </div>
        </form>
    </div>

</script>
</html>

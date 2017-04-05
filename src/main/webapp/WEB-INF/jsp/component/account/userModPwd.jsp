<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.edpos.common.constant.GlobalConstant" %>
<!DOCTYPE html>
<html>
<head>
    <title>修改用户密码－<%=GlobalConstant.PLATFORM_TITLE%></title>
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
    <div class="title-left-line">修改密码</div>
    <div class="title-bottom-line"></div>
    <div class="wrapper">
        <div class="row">
            <div class="col-lg-12 col-md-12">
                <div class="layui-form-item">
                    <label class="layui-form-label" style="width: 100px;">手机号码</label>
                    <div class="layui-input-inline">
                        <input type="text" name="account" id="account" value="" lay-verify="phone" placeholder="请输入手机号码"  autocomplete="off" class="layui-input">
                    </div>
                    <div class="layui-input-inline">
                        <button class="layui-btn" id="querying">查询</button>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label" style="width: 100px;">用户姓名</label>
                    <div class="layui-input-inline">
                        <input type="text" name="userName" id="userName" value="" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label" style="width: 100px;">联系电话</label>
                    <div class="layui-input-inline">
                        <input type="text" name="tel" id="tel" class="layui-input" value="">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label" style="width: 100px;">用户邮箱</label>
                    <div class="layui-input-inline">
                        <input type="text" name="email" id="email" class="layui-input" value="">
                    </div>
                    <div class="layui-input-inline">
                        <button class="layui-btn" onclick="chgPwd();">修改密码</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script id="userChgPwdTpl" type="text/html">

    <div style="padding-top: 30px; margin-right: 50px">
        <form class="layui-form" id="chgPwdForm">

            <div class="layui-form-item">
                <label class="layui-form-label">新密码</label>
                <div class="layui-input-block">
                    <input type="password" name="password" id="password"   lay-verify="required" placeholder="请填写新密码"    autocomplete="off" class="layui-input"  >
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-input-block">
                    <button class="layui-btn" lay-submit lay-filter="chggPwdForm">立即提交</button>
                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                </div>
            </div>
        </form>
    </div>
</script>

<!-- 全局js -->
<jsp:include page="../../frame/js.jsp"></jsp:include>
<script>
    var uid = 0;
    layui.use(['form', 'layer','laytpl'], function(){});
    $('#querying').on('click',
        function() {
            if($('#account').val() == ""){
                layer.msg('请输入手机号码', {time: 300000, btn: ['知道了'],});
                return false;
            }
            var postData = {'account':$('#account').val()};
            $.post('/acc/getEdposUserByAccount', postData,
                function (data) {
                    if(data.obj != null){
                        if(data.success){
                            uid = data.obj.uid;
                            $("#account").val(data.obj.account);
                            $("#userName").val(data.obj.userName);
                            $("#tel").val(data.obj.tel);
                            $("#email").val(data.obj.email);
                        }else{
                            layer.msg(data.msg);
                        }
                    }else{
                        uid = 0;
                        $("#userName").val("");
                        $("#tel").val("");
                        $("#email").val("");
                        layer.msg("平台没有该用户信息，请输入正确的手机号码。");
                    }
                }
            );
        }
    );

    function chgPwd(){
        if(uid == 0){
            layer.msg('请输入手机号码查询用户信息修改密码', {time: 300000, btn: ['知道了'],});
            return false;
        }
        openChgPwdLayer('修改密码',{'uid':uid});
    }

    function openChgPwdLayer(title, indata){
        var tplHtml;
        layui.laytpl(userChgPwdTpl.innerHTML).render(indata, function(html){
            tplHtml = html;
        });
        layerIndex = layer.open({
            type : 1,
            title : title,
            success: function(){
                form = layui.form();
                form.render();
                form.on('submit(chggPwdForm)', function(data){
                    var postData = {'uid' : uid,'password' : $("#password").val()};
                    $.post('/acc/chgUserPassword', postData,
                            function (data) {
                                layer.close(layerIndex);
                                if(data.success){
                                    layer.msg("密码修改成功，请通知用户用新的密码登录。");
                                }else{
                                    layer.msg(data.msg);
                                }
                            }
                    );
                    return false;
                });
            },
            shadeClose : true,
            area : [ '600px', '200px' ],
            content : tplHtml
        });
    }
</script>
</body>
</html>

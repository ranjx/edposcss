<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.edpos.common.constant.GlobalConstant" %>
<!DOCTYPE html>
<html>
<head>
    <title>订单实例详情－<%=GlobalConstant.PLATFORM_TITLE%></title>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
    <meta http-equiv="Cache-Control" content="no-transform" />
    <meta name="renderer" content="webkit" />
    <meta name="description"   content="<%=GlobalConstant.PLATFORM_DESCRIPTION%>"/>
    <meta name="keywords" content="<%=GlobalConstant.PLATFORM_KEYWORKS%>"/>
    <jsp:include page="../../frame/css.jsp"></jsp:include>
    <style>
        .order-detail{background:#fff;padding:25px 22px}.order-detail .kv-item{font-size:12px}.order-detail .kv-item .kv-label{color:#000}.order-detail .order-hd{padding:0 18px;border-left:3px solid #00a2ca}.order-detail .order-hd .btn{float:right}.order-detail .order-hd .kv-item{float:left}.order-detail .order-hd .kv-item .num{font-size:14px;color:#ff7200}.order-detail .order-hd .btn-red{padding:0 60px;font-size:12px}.order-detail .order-basic{padding:0 20px;margin-bottom:15px}.order-detail .order-basic .kv-item{float:left;margin-right:60px;margin-top:0}.order-detail .order-basic .cance-tip{float:right;font-size:12px;line-height:32px}.order-detail .more-info{margin-bottom:30px;background:#f0f0f0;border:1px solid #d9d9d9;padding-bottom:15px}.order-detail .more-info table{margin-bottom:35px;width:100%}.order-detail .more-info table th{padding-left:40px;height:40px;padding-top: 10px;border-bottom:1px solid #d9d9d9}.order-detail .more-info table td{padding-left:40px;height:40px;padding-top: 20px;}.order-detail .more-info .opt{float:right}.order-detail .more-info .opt a{margin-right:25px}.order-detail .other-info .kv-item{padding-left:160px;border-bottom:1px solid #d9d9d9;margin-top:8px}.order-detail .other-info .kv-item .kv-label{width:160px;margin-left:-160px}.order-detail .status li span{margin-right:15px}.order-detail .status li .status-time{color:#969696}
    </style>
</head>

<body>
<div class="bd-content" style="padding-left: 5px;">
    <div class="btn-group" style="float: right;padding-right: 120px;">
        <button class="layui-btn" id="goBack">
            <i class="layui-icon">&#xe62f;</i> 返回上一页
        </button>
    </div>
    <div class="title-left-line">订单详情</div>
    <div class="title-bottom-line"></div>
    <div class="wrapper">
        <div class="row">
            <div class="col-lg-11 col-md-11">
                <div class="order-detail page" data-tab="data-result">
            <div class="order-hd clearfix">
            <div class="kv-item">
                <div class="kv-label">订单编号：</div>
            <div class="kv-content num" id="orderNum"></div>
            </div>
                <button class="btn btn-red" id="payState"><span>已完成</span></button>
            </div>
            <div class="order-basic clearfix">
            <div class="kv-item">
            <div class="kv-label">订单提交时间：</div>
            <div class="kv-content num" id="orderTime"></div>
            </div>
            </div>
            <div class="more-info clearfix">
            <table>
            <thead>
            <tr>
            <th>产品服务</th>
            <th>总金额（元）</th>
            <th>提交日期</th>
            <th>生效日期</th>
            <th>失效日期</th>
            </tr>
            </thead>
            <tbody id="orderInstanceDetail"></tbody>
            </table>
            </div>

            <div class="more-info clearfix">
            <table>
            <thead>
            <tr>
            <th>产品服务</th>
            <th>服务属性</th>
            <th>服务属性值</th>
            </tr>
            </thead>
            <tbody id="orderSoProdAttrDetail"></tbody>
            </table>
            </div>
            </div>
                <div class="title-bottom-line"></div>
                <div class="other-info" style="padding-left: 20px;">
                    <div class="kv-item clearfix">
                        <div class="kv-label">付款银行：</div>
                        <div class="kv-content" id="payOrg"></div>
                    </div>
                    <div class="kv-item clearfix">
                        <div class="kv-label">付款城市：</div>
                        <div class="kv-content" id="payCity"></div>
                    </div>
                    <div class="kv-item clearfix">
                        <div class="kv-label">付款金额：</div>
                        <div class="kv-content" id="payValue"></div>
                    </div>
                    <div class="kv-item clearfix">
                        <div class="kv-label">备注信息：</div>
                        <div class="kv-content" id="payInfo"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 全局js -->
<jsp:include page="../../frame/js.jsp"></jsp:include>
</body>
<script>
    layui.use(['layer'], function(){});
    var orderId;
    $(function () {
        var orderInstanceDetail = "";
        var orderSoProdAttrDetail = "";
        var objInsProds = JSON.parse('${insProds}');
        var objSoProdAttrs = JSON.parse('${soProdAttrs}');
        var objSoPayInfo = JSON.parse('${soPayInfo}');
        //实例详情
        $.each(objInsProds, function(i,val){
            var orderTime = formatDateZh(val.createTime);
            var validTime = formatDateZh(val.validTime);
            var expireTime = formatDateZh(val.expireTime);
            $("#orderNum").html(val.orderId);
            $("#orderTime").html(orderTime);
            orderId = val.orderId;
            orderInstanceDetail +="<tr><td>"+val.prodName+"</td>";
            orderInstanceDetail +="<td>"+val.totalFee+"</td>";
            orderInstanceDetail +="<td>"+orderTime+"</td>";
            orderInstanceDetail +="<td>"+validTime+"</td>";
            orderInstanceDetail +="<td>"+expireTime+"</td></tr>";
        });
        $("#orderInstanceDetail").html(orderInstanceDetail);

        //属性详情
        $.each(objSoProdAttrs, function(i,val){
            orderSoProdAttrDetail +="<tr><td>"+val.prodName+"</td>";
            orderSoProdAttrDetail +="<td>"+val.attrName+"</td>";
            orderSoProdAttrDetail +="<td>"+val.attrText+"</td>";
        });
        $("#orderSoProdAttrDetail").html(orderSoProdAttrDetail);

        if(objSoPayInfo!=null){
            $("#payOrg").html(getPayOrgName(objSoPayInfo.payOrg));
            $("#payCity").html(objSoPayInfo.payCity);
            $("#payValue").html(objSoPayInfo.payValue);
            $("#payInfo").html(objSoPayInfo.payInfo);
        }
    })

    $('#payState').click(function() {
        layer.msg('订单已竣工，可通知用户开始使用服务。', {
            time: 300000, //300s后自动关闭
            btn: ['知道了'],
        });
    });

    $('#goBack').on('click', function() {
        window.history.back();
    });
</script>
</html>

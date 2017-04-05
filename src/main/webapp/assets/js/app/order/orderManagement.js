layui.use(['layer'], function(){});
var dataTable = $('#ccsOrderDataTable').bootstrapTable({
    columns : [{
        field : 'orderId',
        title : '订单编号'
    }, {
        field : 'orderName',
        title : '订单名称'
    },  {
        field : 'orderType',
        title : '订单类型',
        formatter : function(value, row, index) {
            switch (value){
                case 'N':
                    return '新购买订单';
                case 'M':
                    return '添加人数订单';
                case 'A':
                    return '续费订单';
                default:
                    return '-';
            }
        }
    },  {
        field : 'orderState',
        title : '订单状态',
        formatter : function(value, row, index) {
            switch (value){
                case 'U':
                    return '未支付';
                case 'W':
                    return '等待确认';
                case 'F':
                    return '支付完成';
                case 'X':
                    return '已撤单';
                default:
                    return '-';
            }
        }
    }, {
        field : 'totalFee',
        title : '总费用(元)'
    }, {
        field : 'agentFee',
        title : '代理商分成(元)',
        formatter : function(value, row, index) {
            if(value!=null){
                return value;
            }
            return '-';
        }
    }, {
        field : 'orderTime',
        title : '提交时间',
        formatter : function(value, row, index) {
            return formatDateEh(row.orderTime);
        }
    }, {
        field : 'buyer',
        title : '购买人',
        formatter : function(value, row, index) {
            return getUserName(row.buyer);
        }
    }, {
        field : 'agentId',
        title : '代理商',
        formatter : function(value, row, index) {
            if(row.agentUid > 0){
                return getUserName(row.agentUid);
            }else{
                return '-';
            }
        }
    },{
        field : 'operate',
        title : '操作',
        halign : 'center',
        align : 'center',
        width: '250px',
        formatter : function(value, row, index) {
            var html = "";
            if(row.orderState == 'U'){
                html +='<a onclick="payDetail('+row.orderId+');" class="layui-btn layui-btn-small layui-btn-normal">详情</a>';
            }
            if(row.orderState == 'W'){
                html +='<a onclick="payDetail('+row.orderId+');" class="layui-btn layui-btn-small layui-btn-normal">详情</a>';
                html +='<a onclick="affirmOrder('+row.orderId+');" class="layui-btn layui-btn-small layui-btn-normal">确认</a>';
            }
            if(row.orderState == 'F'){
                html +='<a onclick="orderInstanceDetail('+row.orderId+');" class="layui-btn layui-btn-small layui-btn-normal">详情</a>';
            }
            return html;
        }
    } ],
    classes :'table table-hover',
    url: "/order/querySoRecords",
    dataField: "rows",
    search: true,
    pagination: true,
    pageSize: 10,
    pageNumber: 1,
    pageList: [10, 20, 50],
    showRefresh: true,
    clickToSelect: true,
    showToggle: true,
    showColumns: true,
    iconSize: 'outline',
    toolbar: '#orderToolbar',
    sidePagination: "server",
    queryParams : queryParams,
});

function queryParams(params) {
    return {
        userName : params.search,
        page: (params.offset/params.limit)+1,
        rows: params.limit
    };
}

//付费详情
function payDetail(orderId) {
    window.location.href = '/order/orderDetail?orderId='+orderId;
}

//订单实例详情
function orderInstanceDetail(orderId) {
    window.location.href = '/order/orderInstanceDetail?orderId='+orderId;
}

//确认订单
function affirmOrder(orderId){
    var postData = {'orderId' : orderId};
    $.post("/ccs/affirmOrder", postData, function(data) {
        if(data.success){
            layer.msg('订单确认成功，请通知客户开始使用服务。', {
                time: 300000, //300s后自动关闭
                btn: ['知道了'],
                success: function(layero){
                    var btn = layero.find('.layui-layer-btn');
                    btn.css('text-align', 'center');
                    btn.find('.layui-layer-btn0').attr({
                        href: 'javascript:location.reload()'
                    });
                }
            });
        }else{
            layer.msg('订单确认失败,请联系后台开发人员', {
                time: 300000, //300s后自动关闭
                btn: ['知道了'],
            });
        }
    });
}
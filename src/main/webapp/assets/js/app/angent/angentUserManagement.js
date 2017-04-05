var layerIndex;
layui.use([ 'form', 'layer','laytpl'], function(){});

var dataTable = $('#angentDataTable').bootstrapTable({
    columns : [  {
        checkbox :true
    }, {
        field : 'angentId',
        title : '代理商编号'
    }, {
        field : 'userName',
        title : '代理商姓名'
    }, {
        field : 'mobile',
        title : '手机号吗'
    },{
        field : 'companyName',
        title : '企业名称'
    },{
        field : 'tel',
        title : '联系电话'
    },{
        field : 'email',
        title : '邮箱'
    },{
        field : 'companyAddress',
        title : '公司地址'
    },{
        field : 'angentState',
        title : '审核状态',
        formatter : function(value, row, index) {
            switch (value){
                case 0:
                    return '待审核';
                case 1:
                    return '审核通过';
                default:
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
            var html = "-";
            if(row.angentState == 0){
                html ='<a href="javascript:;" onclick="auditPass('+row.angentId+')" class="layui-btn layui-btn-small layui-btn-normal">通过</a>';
            }
            return html;
        }
    } ],
    classes :'table table-hover',
    url: "/angent/queryAngentInfo",
    dataField: "rows",
    search: true,
    pagination: true,
    pageSize: 10, //每页的记录行数
    pageNumber: 1, //初始化加载第一页，默认第一页
    pageList: [10, 20, 50], //可供选择的每页的行数
    showRefresh: true,
    clickToSelect: true, //是否启用点击选中行
    showToggle: true,
    showColumns: true,
    iconSize: 'outline',
    toolbar: '#angentToolbar',
    sidePagination: "server", //分页方式：client客户端分页，server服务端分页
    queryParams : queryParams,
});

function queryParams(params) {
    return {
        customerId: params.customerId,
        userName : params.search,
        page: (params.offset/params.limit)+1,
        rows: params.limit
    };
}

//添加客户
$('#btnAdd').on('click',
    function() {
        openLayer('代理商添加',{});
    }
);

//审核通过
function auditPass(angentId) {
    var postData = {'angentId' : angentId};
    $.post("/angent/affirmPassAngent", postData, function(data) {
        if(data.success){
            layer.msg('审核通过，请通知代理商可以录入客户信息。', {
                time: 300000,
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
            layer.msg('审核代理商信息失败,请联系后台开发人员', {
                time: 300000,
                btn: ['知道了'],
            });
        }
    });
}

function openLayer(title, inData){
    var tplHtml;
    layui.laytpl(angentUserTpl.innerHTML).render(inData, function(html){
        tplHtml = html;
    });

    layerIndex = layer.open({
        type : 1,
        title : title,
        area:['400','400'],
        success: function(){
            form = layui.form();
            form.render();
            form.on('submit(angentUserForm)', function(data){
                $.post('/angent/registerAngent', data.field,
                    function (data) {
                        layer.close(layerIndex);
                        if(data.success){
                            swal('保存成功！', '', 'success');
                            $('#angentDataTable').bootstrapTable('refresh');
                        }else{
                            swal('保存失败！', data.msg, 'warning');
                        }
                    }
                );
                return false;
            });
        },
        shadeClose : true,
        area : [ '600px', '520px' ],
        content : tplHtml
    });
}

function setValue(value,defaultValue){
    var rtnValue;
    if(defaultValue === undefined)rtnValue = '';
    else rtnValue = defaultValue;

    if(value !== undefined) return value;
    else return rtnValue;
}

function isNotEquals(value1,value2, trueValue,falseValue){
    if( value1 !== value2) return trueValue;
    else return falseValue;
}
function isEquals(value1,value2, trueValue,falseValue){
    if( value1 === value2) return trueValue;
    else return falseValue;
}
/*!
 * Remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */


function rowStyle(row, index) {
  var classes = ['active', 'success', 'info', 'warning', 'danger'];

  if (index % 2 === 0 && index / 2 < classes.length) {
    return {
      classes: classes[index / 2]
    };
  }
  return {};
}

function scoreSorter(a, b) {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}

function nameFormatter(value) {
  return value + '<i class="icon wb-book" aria-hidden="true"></i> ';
}

function starsFormatter(value) {
  return '<i class="icon wb-star" aria-hidden="true"></i> ' + value;
}

function queryParams() {
  return {
    type: 'owner',
    sort: 'updated',
    direction: 'desc',
    per_page: 100,
    page: 1
  };
}

function buildTable($el, cells, rows) {
  var i, j, row,
    columns = [],
    data = [];

  for (i = 0; i < cells; i++) {
    columns.push({
      field: '字段' + i,
      title: '单元' + i
    });
  }
  for (i = 0; i < rows; i++) {
    row = {};
    for (j = 0; j < cells; j++) {
      row['字段' + j] = 'Row-' + i + '-' + j;
    }
    data.push(row);
  }
  $el.bootstrapTable('destroy').bootstrapTable({
    columns: columns,
    data: data,
    iconSize: 'outline',
    icons: {
      columns: 'glyphicon-list'
    }
  });
}

(function(document, window, $) {
  'use strict';
  // Example Bootstrap Table Large Columns
  // -------------------------------------
  buildTable($('#exampleTableLargeColumns'), 50, 50);

  // Example Bootstrap Table Events
  // ------------------------------
  (function() {
    $('#exampleTableEvents').bootstrapTable({
      url: "/acc/queryEdposOrg",///assets/js/test/bootstrap_table_test.json
      dataField: "rows",//服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
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
      toolbar: '#exampleTableEventsToolbar',
      sidePagination: "server", //分页方式：client客户端分页，server服务端分页
      queryParams : queryParams,
      icons: {
        refresh: 'glyphicon-repeat',
        toggle: 'glyphicon-list-alt',
        columns: 'glyphicon-list'
      }
    });

    var $result = $('#examplebtTableEventsResult');
    $('#exampleTableEvents').on('all.bs.table', function(e, name, args) {
        console.log('Event:', name, ', data:', args);
      })
      .on('click-row.bs.table', function(e, row, $element) {
        $result.text('Event: click-row.bs.table');
      })
      .on('dbl-click-row.bs.table', function(e, row, $element) {
        $result.text('Event: dbl-click-row.bs.table');
      })
      .on('sort.bs.table', function(e, name, order) {
        $result.text('Event: sort.bs.table');
      })
      .on('check.bs.table', function(e, row) {
        $result.text('Event: check.bs.table');
      })
      .on('uncheck.bs.table', function(e, row) {
        $result.text('Event: uncheck.bs.table');
      })
      .on('check-all.bs.table', function(e) {
        $result.text('Event: check-all.bs.table');
      })
      .on('uncheck-all.bs.table', function(e) {
        $result.text('Event: uncheck-all.bs.table');
      })
      .on('load-success.bs.table', function(e, data) {
        $result.text('Event: load-success.bs.table');
      })
      .on('load-error.bs.table', function(e, status) {
        $result.text('Event: load-error.bs.table');
      })
      .on('column-switch.bs.table', function(e, field, checked) {
        $result.text('Event: column-switch.bs.table');
      })
      .on('page-change.bs.table', function(e, size, number) {
        $result.text('Event: page-change.bs.table');
      })
      .on('search.bs.table', function(e, text) {
        $result.text('Event: search.bs.table');
      });
  })();
})(document, window, jQuery);

function queryParams(params) {
  return {
    offset: params.offset,
    limit: params.limit,
  };
}

$('#btnAdd').click(function() {
  layerIndex = layer.open({
    title: "添加组织",
    area:['400px','400px'],
    btn: ["提交","关闭"],
    yes : function() {
      var obj = $.serializeObject($('#edposOrgForm'));
      var rtn = $("#edposOrgForm").validate().form();
      if(rtn){
        $.post("/acc/createEdposOrg", obj,
            function(data) {
              var success = data.success;
              var msg = data.msg;
              if(success){
                layer.close(layerIndex);
                alert("添加成功");
                $('#exampleTableEvents').bootstrapTable('refresh');
              }else{
                showError(msg);
              }
            }
        );
      }
    },
    content: $('#deal').html()
  });
});

$('#btnEdit').click(function() {
  if(getIdSelectLength()>1){
    alert("只能单条修改");
    return;
  }
  if(getIdSelectLength()==0){
    alert("请选择需要编辑的行");
    return;
  }
  layerIndex = layer.open({
    title: "修改组织",
    area:['400px','400px'],
    btn: ["提交","关闭"],
    yes : function() {
      var obj = $.serializeObject($('#edposOrgForm'));
      var rtn = $("#edposOrgForm").validate().form();
      if(rtn){
        $.post("/acc/updateEdposOrg", obj,
            function(data) {
              var success = data.success;
              var msg = data.msg;
              if(success){
                layer.close(layerIndex);
                $('#exampleTableEvents').bootstrapTable('refresh');
              }else{
                showError(msg);
              }
            }
        );
      }
    },
    content: $('#deal').html(),
  });
  setFormSelection();
});

$('#btnDel').click(function() {
  if(getIdSelectLength()==0){
    alert("请选择需要删除的行");
    return;
  }
  var ids = getIdSelections();
  $.post("/acc/deleteEdposOrg?ids="+ids, null,
      function (data) {
        var success = data.success;
        var msg = data.msg;
        if (success) {
          $('#exampleTableEvents').bootstrapTable('refresh');
        } else {
          showError(msg);
        }
      }
  );
});

function setFormSelection(){
  var ids = $.map($('#exampleTableEvents').bootstrapTable('getSelections'), function (row) {
    $("#orgId").val(row.orgId);
    $("#orgName").val(row.orgName);
    $("#parentId").val(row.parentId);
  });

}

function getIdSelections() {
  var ids = $.map($('#exampleTableEvents').bootstrapTable('getSelections'), function (row) {
    return row.orgId;
  });
  return ids;
}

function getIdSelectLength() {
  var ids = $.map($('#exampleTableEvents').bootstrapTable('getSelections'), function (row) {
    return row.orgId;
  });
  return ids.length;
}
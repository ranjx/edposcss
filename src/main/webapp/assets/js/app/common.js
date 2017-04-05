/**
 * @author 鸵鸟
 *
 * @requires jQuery
 *
 * 防止退格键导致页面回退
 */
$(document).keydown(function (e) {
    var doPrevent;
    if (e.keyCode == 8) {
        var d = e.srcElement || e.target;
        if (d.tagName.toUpperCase() == 'INPUT' || d.tagName.toUpperCase() == 'TEXTAREA') {
            doPrevent = d.readOnly || d.disabled;
        }else if(d.tagName.toUpperCase() == 'DIV'){
            doPrevent = false;
        }else{
            doPrevent = true;
        }
    }else{
        doPrevent = false;
    }
    if (doPrevent)
        e.preventDefault();
});


var showError = function (text) {
    $('.error-tips').text(text).show();
    setTimeout(clearError, 4000);
}

var clearError = function () {
    $('.error-tips').hide();
}


var showFieldTips = function (fieldName, text) {
    var field = $('.field[name=' + fieldName + ']');
    var tip = field.parent().find('.field-tips');
    tip.show();
    tip.text(text);
}

var clearFieldTips = function (fieldName) {

    var field = $('.field[name=' + fieldName + ']');
    var tip = field.parent().find('.field-tips');
    tip.hide();
    tip.html('&nbsp;');
}


function isEmpty(exp){
    if (exp === null || exp.trim().length == 0)
    {
        return true;
    }
    return false;
}


/**
 * Create a cookie with the given key and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain used when the cookie was set.
 *
 * @param String
 *            key The key of the cookie.
 * @param String
 *            value The value of the cookie.
 * @param Object
 *            options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object. If a negative value is specified (e.g. a date in the past), the cookie will be deleted. If set to null or omitted, the cookie will be a session cookie and will not be retained when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 *
 * Get the value of a cookie with the given key.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String
 *            key The key of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
$.cookie = function(key, value, options) {
    if (arguments.length > 1 && (value === null || typeof value !== "object")) {
        options = $.extend({}, options);
        if (value === null) {
            options.expires = -1;
        }
        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }
        return (document.cookie = [ encodeURIComponent(key), '=', options.raw ? String(value) : encodeURIComponent(String(value)), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : '' ].join(''));
    }
    options = value || {};
    var result, decode = options.raw ? function(s) {
        return s;
    } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};

/**
 * @author 孙宇
 *
 * @requires jQuery
 *
 * 将form表单元素的值序列化成对象
 *
 * @returns object
 */
$.serializeObject = function(form) {
    var o = {};
    $.each(form.serializeArray(), function(index) {
        if (o[this['name']]) {
            o[this['name']] = o[this['name']] + "," + this['value'];
        } else {
            o[this['name']] = this['value'];
        }
    });
    return o;
};


/**
 * 序列化表单为json对象
 */

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
/**
 * 合并两个json对象属性为一个对象
 * @param o1
 * @param o2
 * @returns o
 */
$.mergeJsonObject = function(o1, o2)
{
    var o={};
    for(var attr in o1){
        o[attr]=o1[attr];
    }
    for(var attr in o2){
        o[attr]=o2[attr];
    }

    return o;
};



/**
 * @author 孙宇
 *
 * 增加formatString功能
 *
 * 使用方法：$.formatString('字符串{0}字符串{1}字符串','第一个变量','第二个变量');
 *
 * @returns 格式化后的字符串
 */
$.formatString = function(str) {
    for ( var i = 0; i < arguments.length - 1; i++) {
        str = str.replace("{" + i + "}", arguments[i + 1]);
    }
    return str;
};

/**
 * @author 孙宇
 *
 * 接收一个以逗号分割的字符串，返回List，list里每一项都是一个字符串
 *
 * @returns list
 */
$.stringToList = function(value) {
    if (value != undefined && value != '') {
        var values = [];
        var t = value.split(',');
        for ( var i = 0; i < t.length; i++) {
            values.push('' + t[i]);/* 避免他将ID当成数字 */
        }
        return values;
    } else {
        return [];
    }
};

/**
 * @author 孙宇
 *
 * @requires jQuery
 *
 * 改变jQuery的AJAX默认属性和方法
 */
$.ajaxSetup({
    type : 'POST',
    error : function(XMLHttpRequest, textStatus, errorThrown) {
        try {
            parent.$.messager.progress('close');
            parent.$.messager.alert('错误', XMLHttpRequest.responseText);
        } catch (e) {
            alert(XMLHttpRequest.responseText);
        }
    }
});
$.loadData = function (url) {
    var result = $.ajax({url: url,async: false}).responseJSON;
    return result;
}
/**
 * @author 孙宇
 *
 * 去字符串空格
 *
 * @returns
 */
String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};
String.prototype.ltrim = function() {
    return this.replace(/(^\s*)/g, '');
};
String.prototype.rtrim = function() {
    return this.replace(/(\s*$)/g, '');
};

function progressLoad(){
}

function progressClose(){

}


//ztree onBodyDown
function onBodyDown(event) {
    if ($(event.target).parents('.ztree-content').length==0) {
        hideMenu();
    }
}
//ztree hideMenu
function hideMenu() {
    $('.ztree-content').fadeOut('fast');
    $('body').unbind('mousedown', onBodyDown);
}


function treeSelect(element,nodes,overrideOnClick,overrideBeforeClick) {
    var obj = $(element);
    var ztreeContentId = element.id+'Content';
    var ztreeId = element.id+'Ztree';
    $('#'+ztreeContentId).remove();
    if($('#'+ztreeContentId).length==0){
        //默认ztree设置
        var defalutZtreeSetting = {view: {dblClickExpand: false},data: {simpleData: {enable: true}},
            callback: {
                onClick: function(e, treeId, treeNode){
                    if (typeof(overrideOnClick) == 'undefined' || overrideOnClick === false) {
                        var obj = $('#'+element.id);
                        obj.attr('value', treeNode.name);
                        obj.data('value',treeNode.id);
                        hideMenu();
                    }
                    else if (typeof(overrideOnClick) != 'undefined' && overrideOnClick === true) {
                        var func=eval(element.id+'onClick');
                        var rtn = func(e, treeId, treeNode);
                        if(rtn=== undefined || rtn===true){
                            hideMenu();
                        }
                    }else{
                        alert('without onclick function');
                    }
                },
                beforeClick: function(treeId, treeNode, clickFlag) {

                    if (typeof(overrideBeforeClick) != 'undefined' && overrideBeforeClick === true) {
                        var func=eval(element.id+'beforeClick');
                        var rtn = func(treeId, treeNode, clickFlag);
                        return rtn;
                    }
                }

            }
        };
        var width = element.clientWidth;
        var ztreeHtml = '<div id="'+ztreeContentId+'" class="ztree-content" style="display:none; position: absolute; border: 1px solid #24AC7E;z-index:20000000; background-color: white">';
        ztreeHtml += '<ul id="'+ztreeId+'" class="ztree" style="margin-top:0; width:'+width+'px;"></ul></div>';
        $('body').append(ztreeHtml);
        $.fn.zTree.init($('#'+ztreeId), defalutZtreeSetting, nodes);
    }
    var objOffset = obj.offset();
    $('#'+ztreeContentId).css({left:objOffset.left + 'px', top:objOffset.top + obj.outerHeight() + 'px'}).slideDown('fast').show();
    $('body').bind('mousedown', onBodyDown);
}

function ztreeShow(ztreeId,nodes,overrideOnClick,overrideBeforeClick) {
    var element = document.getElementById(ztreeId);
    var defalutZtreeSetting = {view: {dblClickExpand: false},data: {simpleData: {enable: true}},
        callback: {
            onClick: function(e, treeId, treeNode){
                if (typeof(overrideOnClick) == 'undefined' || overrideOnClick === false) {
                    var obj = $('#'+element.id);
                    obj.attr('value', treeNode.name);
                    obj.data('value',treeNode.id);
                    hideMenu();
                }
                else if (typeof(overrideOnClick) != 'undefined' && overrideOnClick === true) {
                    var func=eval(element.id+'onClick');
                    var rtn = func(e, treeId, treeNode);
                    if(rtn=== undefined || rtn===true){
                        hideMenu();
                    }
                }else{
                    alert('without onclick function');
                }
            },
            beforeClick: function(treeId, treeNode, clickFlag) {

                if (typeof(overrideBeforeClick) != 'undefined' && overrideBeforeClick === true) {
                    var func=eval(element.id+'beforeClick');
                    var rtn = func(treeId, treeNode, clickFlag);
                    return rtn;
                }
            }

        }
    };
    $.fn.zTree.init($('#'+ztreeId), defalutZtreeSetting, nodes);
}
function formatDateZhYMD(timeInMillos){
    var d = new Date(timeInMillos);
    var m = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
    var day = (d.getDate()) < 10 ? "0" + (d.getDate()) : (d.getDate());
    return d.getFullYear() + "/" + m + "/" + day;
}

function formatDateChainYM(timeInMillos){
    var d = new Date(timeInMillos);
    var m = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
    return d.getFullYear() + "年" + m + "月";
}

function formatDateChainYMD(timeInMillos){
    var d = new Date(timeInMillos);
    var m = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
    var day = (d.getDate()) < 10 ? "0" + (d.getDate()) : (d.getDate());
    return d.getFullYear() + "年" + m + "月" + day + "日 ";
}

function formatDateZh(timeInMillos){
    var d = new Date(timeInMillos);
    var m = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
    var day = (d.getDate()) < 10 ? "0" + (d.getDate()) : (d.getDate());
    var h = (d.getHours()) < 10 ? "0" + (d.getHours()) : (d.getHours());
    var mi = (d.getMinutes()) < 10 ? "0" + (d.getMinutes()) : (d.getMinutes());
    var ss = (d.getSeconds()) < 10 ? "0" + (d.getSeconds()) : (d.getSeconds());
    return d.getFullYear() + "年" + m + "月" + day + "日 " + h + ":" + mi + ":" + ss;
}

function formatDateZhSFM(timeInMillos){
    var d = new Date(timeInMillos);
    var h = (d.getHours()) < 10 ? "0" + (d.getHours()) : (d.getHours());
    var mi = (d.getMinutes()) < 10 ? "0" + (d.getMinutes()) : (d.getMinutes());
    var ss = (d.getSeconds()) < 10 ? "0" + (d.getSeconds()) : (d.getSeconds());
    return h + ":" + mi + ":" + ss;
}

function formatDateEh(timeInMillos){
    var d = new Date(timeInMillos);
    var m = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
    var day = (d.getDate()) < 10 ? "0" + (d.getDate()) : (d.getDate());
    var h = (d.getHours()) < 10 ? "0" + (d.getHours()) : (d.getHours());
    var mi = (d.getMinutes()) < 10 ? "0" + (d.getMinutes()) : (d.getMinutes());
    var ss = (d.getSeconds()) < 10 ? "0" + (d.getSeconds()) : (d.getSeconds());
    return d.getFullYear() + "-" + m + "-" + day + " " + h + ":" + mi + ":" + ss;
}

function formatDateChain(uid,second) {
    var str = "<span style='color: #ff7e26;cursor:pointer;' title='点击查看详情' onclick='openOnlineUserLogLayer("+uid+");'>"+ second + "</span>" + "秒";
    if(second > 60){
        str = "<span style='color: #ff7e26;cursor:pointer;' title='点击查看详情' onclick='openOnlineUserLogLayer("+uid+");'>" + Math.round(second/60) + "</span>" + "分钟";
    }
    if(second > 60*60){
        str = "<span style='color: #ff7e26;cursor:pointer;' title='点击查看详情' onclick='openOnlineUserLogLayer("+uid+");'>" + Math.round(second/60/60) + "</span>" + "小时";
    }
    if(second > 60*60*24){
        str = "<span style='color: #ff7e26;cursor:pointer;' title='点击查看详情' onclick='openOnlineUserLogLayer("+uid+");'>" + Math.round(second/60/60/24) + "</span>" + "天";
    }
    return str;
}

function formatPercent(second,format) {
    if(format == 0){
        return Math.round(second/60/60/24*100) + "%";
    }
    if(format == 1){
        return Math.round(second/60/60/24/30*100) + "%";
    }
}

/**
 * 解析时间 2012-12-25 12:30:24 or 2012-12-25 为秒数
 * @param timeSecnods
 * @returns
 */
function parseDatetime(strDate){
    try{
        if(strDate.length == 10 && strDate.length != 19){
            return 0;
        }
        var tYear = strDate.substring(0,4);
        var tMonth = strDate.substring(5,7);
        var tDay = strDate.substring(8,10);
        if(strDate.length == 19){
            var hour = strDate.substring(11,13);
            var minute = strDate.substring(14,16);
            var second = strDate.substring(17,19);
            return Date.UTC(tYear, new Number(tMonth) - 1, tDay, hour, minute, second);
        } else {
            return Date.UTC(tYear, new Number(tMonth) - 1, tDay);
        }
    }catch(exs){
        alert("解析时间失败:"+exs.message);
        return false;
    }

}

function getMap() {//初始化map_,给map_对象增加方法，使map_像Map
    var map_ = new Object();
    map_.put = function(key, value) {
        map_[key+'_'] = value;
    };
    map_.get = function(key) {
        return map_[key+'_'];
    };
    map_.remove = function(key) {
        delete map_[key+'_'];
    };
    map_.keyset = function() {
        var ret = "";
        for(var p in map_) {
            if(typeof p == 'string' && p.substring(p.length-1) == "_") {
                ret += ",";
                ret += p.substring(0,p.length-1);
            }
        }
        if(ret == "") {
            return ret.split(",");
        } else {
            return ret.substring(1).split(",");
        }
    };
    return map_;

}

//获取用户名称
function getUserName(uid){
    var result = $.loadData('/acc/getUserName?uid='+uid);
    return result.obj;
}

//获取组织名称
function getOrgName(orgId){
    var result = $.loadData('/acc/getOrgName?orgId='+orgId);
    return result.obj;
}

/*获取用户状态
0	离线
1	离开
2	忙碌
3	开车
4	吃饭
5	电话
6	睡觉
7	在线
8	自定义离开
100 直播*/
function getUserState(displayState){
    var result = displayState;//$.loadData('/acc/getUserStateByUid?uid='+uid);
    var stateHtml = "";
    if(result == 0){
        stateHtml+="<i class='iconfont icon-zhuangtai-lixian' style='color: #a3a8ad;' title='离线'></i>";
    }
    if(result == 1){
        stateHtml+="<i class='iconfont icon-zhuangtai-likai' style='color: #a2aaaf;' title='离开'></i>";
    }
    if(result == 2){
        stateHtml+="<i class='iconfont icon-zhuangtai-manglu' style='color: #e35850;' title='忙碌'></i>";
    }
    if(result == 3){
        stateHtml+="<i class='iconfont icon-zhuangtai-lixian' style='color: #a3a8ad;' title='开车'></i>";
    }
    if(result == 4){
        stateHtml+="<i class='iconfont icon-zhuangtai-jiucan' style='color: #fdab36;' title='吃饭'></i>";
    }
    if(result == 5){
        stateHtml+="<i class='iconfont icon-zhuangtai-dianhua' style='color: #45c7fe;' title='电话'></i>";
    }
    if(result == 6){
        stateHtml+="<i class='iconfont icon-zhuangtai-shuijue' style='color: #cf5ff9;' title='睡觉'></i>";
    }
    if(result == 7){
        stateHtml+="<i class='iconfont icon-zhuangtai-zaixian' style='color: #5fb41b;' title='在线'></i>";
    }
    if(result == 8){
        stateHtml+="<i class='iconfont icon-zhuangtai-yinshen' style='color: #fdab36;' title='离开'></i>";
    }
    if(result == 100){
        stateHtml+="<i class='iconfont icon-zhuangtai-zaixian' style='color: #5fb41b;' title='在线'></i>";
    }
    return stateHtml;
}

//定位状态 0 关闭 1 开启 2 定位 3 超时 4 停留 5 低速 6 高速 7 无定位位置 null 未登录
function getUserLocState(state,sumtime){
    var stateHtml = "";
    if(state == null){
        stateHtml+="<i class='iconfont icon-zhuangtai-weidenglu' style='font-size: 22px;' title='未登录'></i>";
    }
    if(state == 0){
        if(sumtime == 0){
            stateHtml+="<i class='iconfont icon-weizhiqueshi1' style='color: red;font-size: 22px;' title='定位关闭'></i>";
        }else{
            stateHtml+="<i class='iconfont icon-weizhiqueshi1' style='color: red;' title='定位关闭"+sumtime+"分钟'></i>";
        }
    }
    if(state == 1){
        stateHtml+="<i class='iconfont icon-weizhigongxiangrenyuan' style='color: #a2aaaf;font-size: 22px;' title='定位开启'></i>";
    }
    if(state == 2){
        stateHtml+="<i class='iconfont icon-btnweizhi' style='color: #fb9940;font-size: 22px;' title='实时'></i>";
    }
    if(state == 3){
        stateHtml+="<i class='iconfont icon-chaoshi' style='color: #fb9940;font-size: 22px;' title='超时'></i>";
    }
    if(state == 4){
        if(sumtime == 0){
            stateHtml+="<i class='iconfont icon-jingzhi' style='color: #ff810e;font-size: 22px;' title='静止'></i>";
        }else{
            stateHtml+="<i class='iconfont icon-tingliu' style='color: #ff810e;font-size: 22px;' title='停留"+sumtime+"分钟'></i>";
        }
    }
    if(state == 5){
        stateHtml+="<i class='iconfont icon-disu' style='color: #15b9fe;font-size: 22px;' title='低速'></i>";
    }
    if(state == 6){
        stateHtml+="<i class='iconfont icon-gaosu' style='color: #fb2828;font-size: 22px;' title='高速'></i>";
    }
    if(state == 7){
        stateHtml+="<i class='iconfont icon-weizhiqueshi' style='font-size: 22px;' title='无定位'></i>";
    }
    return stateHtml;
}

//获取在线用户总数
function getOnlineUser(uid){
    var result = $.loadData('/acc/getPartyOnlineNum?uid='+uid);
    return result.obj;
}

//获取频道在线用户总数
function getChannelOnlineUser(channelId){
    var result = $.loadData('/ptt/getChannelUserNum?channelId='+channelId);
    return result.obj;
}

//获取消息总数
function getSysMsgCount(msgType) {
    var result = $.loadData('/notifi/getSysMsgCount?msgType='+msgType);
    return result.obj;
}

//获取频道名称
function getChannelName(channelId) {
    var result = $.loadData('/ptt/getChannelName?channelId='+channelId);
    return result.obj;
}

//判断用户是否登录PC客户端
function checkUserOnlinePC(uid) {
    var result = $.loadData('/ptt/checkUserOnline?uid='+uid);
    return result;
}

//获取频道资源总数
function getChannelResouceCount(channelId) {
    var result = $.loadData('/event/getChannelResouceCount?channelId='+channelId);
    return result.obj;
}

//获取交通工具
function getTraffic(uid) {
    var traff = "";
    var result = $.loadData('/acc/getUserToos?uid='+uid);
    if(result.obj == null){
        traff = "/assets/image/frame/car.png?" + version();
    }
    if(result.obj == '1'){
        traff = "/assets/image/frame/userPoi.png?" + version();
    }
    if(result.obj == '2'){
        traff = "/assets/image/frame/car.png?" + version();
    }
    if(result.obj == '3'){
        traff = "/assets/image/frame/mtc.png?" + version();
    }
    return traff;
}

function getTrafficMarker(uid) {
    var marker = "";
    var result = $.loadData('/acc/getUserToos?uid='+uid);
    if(result.obj == null){
        //marker = "marker";
        marker = "/assets/image/frame/cur_loc_24.png";
    }
    if(result.obj == '1'){
        //marker = "marker";
        marker = "/assets/image/frame/cur_loc_24.png";
    }
    if(result.obj == '2'){
        //marker = "marker-car";
        marker = "/assets/image/frame/car.png";
    }
    if(result.obj == '3'){
        //marker = "marker-mtc";
        marker = "/assets/image/frame/mtc.png";
    }
    return marker;
}


function version(){
    var dt = new Date();
    return "version=" + dt.getTime();
}

//获取用户信息
function getUsers(){
    var result = $.loadData('/acc/queryEdposUsers?displayState=99');
    return result.rows;
}

//获取组织信息
function getOrgInfos(){
    var result = $.loadData('/acc/queryEdposOrgByParentId?parentId=0');
    return result.rows;
}

//获取支付银行
function getPayOrgName(payOrg) {
    var payOrgName = "";
    if(payOrg == 1){
        payOrgName = "建设银行";
    }
    if(payOrg == 2){
        payOrgName = "农业银行";
    }
    if(payOrg == 3){
        payOrgName = "交通银行";
    }
    if(payOrg == 4){
        payOrgName = "中国银行";
    }
    if(payOrg == 5){
        payOrgName = "招商银行";
    }
    if(payOrg == 6){
        payOrgName = "邮政储蓄";
    }
    if(payOrg == 7){
        payOrgName = "工商银行";
    }
    if(payOrg == 8){
        payOrgName = "支付宝转账";
    }
    if(payOrg == 9){
        payOrgName = "微信转账";
    }
    if(payOrg == 99){
        payOrgName = "其他";
    }
    return payOrgName;
}

function getChannnelUserType(type){
    var typeHtml = "<i class='iconfont icon-guanli' style='color: #2d72e9;font-size: 24px;' title='管理'></i>";
    if(type == 10){
        typeHtml ="<i class='iconfont icon-shizhu' style='color: #fc3232;font-size: 24px;' title='室主'></i>";
    }
    if(type == 7){
        typeHtml ="<i class='iconfont icon-fushizhu' style='color: #b31def;font-size: 24px;' title='副室主'></i>";
    }
    if(type == 4){
        typeHtml ="<i class='iconfont icon-guanli' style='color: #2d72e9;font-size: 24px;' title='管理'></i>";
    }
    if(type == 3){
        typeHtml ="<i class='iconfont icon-linshiguanli' style='color: #43d4f7;font-size: 24px;' title='临管'></i>";
    }
    return typeHtml;
}


/**
 * 获取上一个月
 *
 * @date 格式为yyyy-mm-dd的日期，如：201401
 */
function getPreMonth(date) {
    var year = date.substr(0,4);//获取当前日期的年份
    var month = date.substr(4,2);//获取当前日期的月份
    var day = 01; //获取当前日期的日
    var days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中月的天数
    var year2 = year;
    var month2 = parseInt(month) - 1;
    if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
    }
    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
        day2 = days2;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }
    var t2 = year2 + month2;
    return t2;
}

/**
 * 获取下一个月
 * @date 格式为yyyy-mm-dd的日期，如：201401
 */
function getNextMonth(date) {
    var year = date.substr(0,4);//获取当前日期的年份
    var month = date.substr(4,2);//获取当前日期的月份
    var day = 01; //获取当前日期的日
    var days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中的月的天数
    var year2 = year;
    var month2 = parseInt(month) + 1;
    if (month2 == 13) {
        year2 = parseInt(year2) + 1;
        month2 = 1;
    }
    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
        day2 = days2;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }
    var t2 = year2 + month2;
    return t2;
}

function doLogout() {
    var postData = {};
    $.post('/doLogout', postData, function (data) {
        var msg = data.msg;
        if(data.success){
            window.location.href = '/login';
        }else{
            alert(msg);
        }
    });
}


$.validator.addMethod('checkPassword', function (value, element) {

    if (!isPasswordValid(value)) {
        return false;
    }
    return true;
}, '请输入密码，由6-16位数字英文组成');
$.validator.addMethod('checkMobile', function (value, element) {
    if (!(/^1[3|4|5|7|8]\d{9}$/.test(value))) {
        return false;
    }
    return true;
}, '请输入有效的手机号码');
$.validator.addMethod('isAccountExist', function (value, element) {
    var deferred = $.Deferred();//创建一个延迟对象
    $.ajax({
        url: '/isAccountExist',
        data: {
            account: $('#account').val()
        },
        success: function (data) {
            var success = data.success;
            if (success)
                deferred.resolve();
            else
                deferred.reject();
        },
        async: false,
        dataType: 'json'
    });
    //deferred.state()有3个状态:pending:还未结束,rejected:失败,resolved:成功
    return deferred.state() == 'resolved' ? true : false;
}, '该手机号码已注册');
$.validator.addMethod('isNotAccountExist', function (value, element) {
    var deferred = $.Deferred();//创建一个延迟对象
    $.ajax({
        url: '/isAccountExist',
        data: {
            account: $('#account').val()
        },
        success: function (data) {
            var success = data.success;
            var obj = data.obj;
            if (!success && obj === 'accountExist')
                deferred.resolve();
            else
                deferred.reject();
        },
        async: false,
        dataType: 'json'
    });
    //deferred.state()有3个状态:pending:还未结束,rejected:失败,resolved:成功
    return deferred.state() == 'resolved' ? true : false;
}, '该手机号码尚未注册');
$.validator.addMethod('checkCaptcha', function (value, element) {
    if (value.length == 4) {
        var deferred = $.Deferred();//创建一个延迟对象
        $.ajax({
            url: '/checkCaptchaCode',
            data: {
                code: $('#code').val()
            },
            success: function (data) {
                var success = data.success;
                if (success)
                    deferred.resolve();
                else
                    deferred.reject();
            },
            async: false,
            dataType: 'json'
        });
        //deferred.state()有3个状态:pending:还未结束,rejected:失败,resolved:成功
        return deferred.state() == 'resolved' ? true : false;
    } else {
        return false;
    }

}, '验证码错误');


$.validator.addMethod('checkSmsCode', function (value, element) {
    if (value.length == 4) {
        var deferred = $.Deferred();//创建一个延迟对象
        $.ajax({
            url: '/checkSmsCode',
            data: {
                mobile: $('#account').val(),
                smsCode: $('#code').val()
            },
            success: function (data) {
                var success = data.success;
                if (success)
                    deferred.resolve();
                else
                    deferred.reject();
            },
            async: false,
            dataType: 'json'
        });
        //deferred.state()有3个状态:pending:还未结束,rejected:失败,resolved:成功
        return deferred.state() == 'resolved' ? true : false;
    } else {
        return false;
    }

}, '短信验证码错误');

function isPasswordValid(pw) {
    return pw.match(/^[0-9a-zA-Z]+$/) && pw.match(/\d/) && pw.match(/[a-zA-Z]/) && pw.length >= 6 && pw.length <= 16;
}
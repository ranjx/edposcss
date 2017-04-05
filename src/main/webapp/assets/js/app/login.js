layui.use([ 'form', 'layer','laytpl','flow'], function(){});
$(document).ready(function () {

    $('#loginBtn').click(function () {
        var _this = $(this);
        if (_this.hasClass('disabled-submit')) {
            return;
        }
        _this.addClass('disabled-submit');
        if (isEmpty($('#account').val())) {
            showError('请输入手机号');
            _this.removeClass('disabled-submit');
            return;
        }
        if (isEmpty($('#password').val())) {
            showError('请输入密码');
            _this.removeClass('disabled-submit');
            return;
        }

        if (isEmpty($('#code').val())) {
            showError('请输入验证码');
            _this.removeClass('disabled-submit');
            return;
        }
        $.post('/doLogin',
            $.serializeObject($('#loginForm')),
            function (data) {
                var success = data.success;
                var msg = data.msg;
                if (success) {
                    if(data.obj == "ccs"){
                        window.location.href = '/frame/ccsMain';
                    }
                    if(data.obj == "angent"){
                        window.location.href = '/frame/angentMain';
                    }
                    if(data.obj == "talking"){
                        window.location.href = '/frame/workMain';
                    }
                } else {
                    layer.msg(msg, {time: 300000, btn: ['知道了'],});
                    //showError(msg);
                    _this.removeClass('disabled-submit');
                    refashJ_captcha();
                }
            }
        );

    });


    $('.reg-main input').keyup(function (event) {

        var _this = $(this);
        var index = _this.attr('tabindex');
        if (event.which == 13) {
            if (isNaN(index)) {
                $('#loginBtn').click();
                return;
            }
            var nextIndex = parseInt(index) + 1;
            var nextInput = $('.reg-main input[tabindex=' + nextIndex + ']');
            if (nextInput.size() > 0) {
                nextInput.focus();
            } else {
                $('#loginBtn').click();
            }
        }
    });

    $("#J_captcha").click(function () {
        var _this = $(this);
        var ts = new Date().getTime();
        _this.attr('src', '/captcha?ts=' + ts);
        $(".field[name=checkcode]").val('');
        $(".field[name=checkcode]").focus();
    });

    //刷新验证码
    function refashJ_captcha() {
        var ts = new Date().getTime();
        $("#J_captcha").attr('src', '/captcha?ts=' + ts);
        $(".field[name=checkcode]").val('');
        $(".field[name=checkcode]").focus();
    }

});

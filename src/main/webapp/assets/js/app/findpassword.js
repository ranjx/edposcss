var second = 60;
var handle;
$(document).ready(function () {
    layui.use([ 'layer' ], function(){

    });
    $("#smsCodeSendBtn").click(function () {
        var rtn = $("#resetPwdForm").validate().element($("#account"));
        if(rtn){
            $.post("/sendSmsCode", {mobile:$("#account").val()},
                function(data) {
                    var success = data.success;
                    var msg = data.msg;
                    if(success){
                        $("#smsCodeSendBtn").addClass("disabled");
                        $("#smsCodeSendBtn").attr("disabled","disabled");
                        layer.msg("验证码已发送至你的手机，请查收");
                        second = 60;
                        handle = setInterval("timer()",1000);
                    }else{
                        layer.msg(msg);
                    }
                });
        }
    });


    $( "#resetPwdForm" ).validate( {
        onfocusout: function(element) { $(element).valid(); },
        rules: {
            account: {
                required:true,
                checkMobile:true,
                isNotAccountExist:true
            },
            code: {
                required:true,
                checkSmsCode:true
            },
            password: {
                required: true,
                checkPassword:true,
                minlength: 6
            },
            repeatPassword: {
                required: true,
                equalTo: "#password"
            }

        },
        messages: {
            account: {
                required: "请输入您的手机号码"
            },
            code: {
                required:  "请输入验证码"
            },
            password: {
                required: "请输入密码",
                minlength: "密码长度至少8位"
            },
            repeatPassword: {
                required: "请再次输入密码",
                equalTo: "两次密码输入不一致"
            }
        },
        errorElement: "p",
        errorPlacement: function ( error, element ) {
            var elementName = element.attr("name");
            if(elementName == "code"){
                if ( $(element).next("i")[0] ) {
                    $(element).next("i")[0].remove();
                }
                if ( !element.next("i")[ 0 ] ) {
                    $("<i class='iconfont icon-erstatus'></i>").insertAfter(element);
                }
            }else{
                error.addClass("field-tips");
                error.insertAfter( element );
                error.show();
            }

        },
        success: function ( label, element ) {
            var elementName = $(element).attr("name");
            if(elementName == "code"){
                if ( $(element).next("i")[0]) {
                    $(element).next("i")[0].remove();
                }
                if ( !$(element).next("i")[ 0 ] ) {
                    $("<i class='iconfont icon-ccstatus'></i>").insertAfter($(element));
                }
            }else{
                label.remove();
            }
        }
    } );




    $("#resetPwdBtn").click(function(){
        var rtn = $("#resetPwdForm").validate().form();
        if(rtn){
            $.post("/resetPasswd",
                $.serializeObject($('#resetPwdForm')),
                function(data) {
                    var success = data.success;
                    var msg = data.msg;
                    if(success){
                        window.location.href = "/complete/resetpwd";
                    }else{
                        showError(msg);
                    }
                }
            );
        }
    });



});

function timer(){
    $("#smsCodeSendBtn").text("重发验证码("+second+"s)");
    second--;
    if(second <= 0){
        clearInterval(handle);
        $("#smsCodeSendBtn").text("获取验证码");
        $("#smsCodeSendBtn").removeAttr("disabled");
        $("#smsCodeSendBtn").removeClass("disabled");
    }
}
jQuery.fn.passwordStrength = function () {
    $(this).live('keyup', function () {
        var pass = $.trim($(this).val());
        //算法如下
        //1. 一个数字计1分
        //2. 一个小写字母计2分
        //3. 一个大写字母计3分
        //4. 一个标点计5分
        //5. 最总总分之和, 小于等于12是弱, 大于12小于等于20是中, 大于20是强
        //其他干涉手段
        //1. 必须集合三种写法才可能到达强
        //2. 如果全部用大写, 那么大写字母只值3分
        //3. 如果全部用小写, 那么小写字母只值2分
        var numericTest = /[0-9]/g;
        var lowerCaseAlphaTest = /[a-z]/g;
        var upperCaseAlphaTest = /[A-Z]/g;
//        var symbolsTest = /[.,!@#$%^&*()}{:<>|]/;
        var score = 0;
        //维度判断
        var vectorScore = 0;

        var statCount = 0;

        var numbers = pass.match(numericTest);
        if (numbers != null) {
            statCount += numbers.length;
            score += (numbers.length * 1);
            if (numbers.length > 0) {
                vectorScore++;
            }
        }

        var lowerCaseLetters = pass.match(lowerCaseAlphaTest);
        if (lowerCaseLetters != null) {
            statCount += lowerCaseLetters.length;
            score += (lowerCaseLetters.length * 2);
            //如果是全小写字母, 一个子算2分
            if (lowerCaseLetters.length == pass.length) {
                score = score - lowerCaseLetters.length * 1;
            }
            if (lowerCaseLetters.length > 0) {
                vectorScore++;
            }
        }

        var upperCaseLetters = pass.match(upperCaseAlphaTest);
        if (upperCaseLetters != null) {
            statCount += upperCaseLetters.length;
            score += (upperCaseLetters.length * 3);
            //如果是全大写字母, 一个只算3分
            if (upperCaseLetters.length == pass.length) {
                score = score - upperCaseLetters.length * 2;
            }

            if (upperCaseLetters.length > 0) {
                vectorScore++;
            }
        }

        //剩下的都是标点符号
        if (pass.length > statCount) {

            var symbolsLength = pass.length - statCount;

            score += (symbolsLength * 5);

            vectorScore++;

        }

        //长度不足6位时始终都是弱
        if (pass.length < 6) {
            score = 0;
        }

        //强的必须要四种都使用
        if (score > 20 && vectorScore < 4) {
            score = 20;
        }


        var exName = $(this).attr('id').split("newPassword")[1];
        var pwdPowerId = "#pwdPower"+exName;

        if (pass == null || pass.length == 0) {
            $(pwdPowerId).hide();
        } else {
            var s_level = 1;
            if (score <= 12) {
                s_level = 1;
            } else if (score <= 20) {
                s_level = 2;
            } else {
                s_level = 3;
            }


            switch (true) {

                case s_level == 1 :
                    $(pwdPowerId).show();
                    $(pwdPowerId).addClass("lenbox lenL");
                    break;

                case s_level == 2 :
                    $(pwdPowerId).show();
                    $(pwdPowerId).addClass("lenbox lenM");
                    break;

                case s_level == 3 :
                    $(pwdPowerId).show();
                    $(pwdPowerId).addClass("lenbox lenH");
                    break;

                default :
                    $(pwdPowerId).hide();
            }
        }
    });
};


(function($){
    $.formatDate = function(pattern,date){
        //如果不设置，默认为当前时间
        if(!date) date = new Date();
        if(typeof(date) ==="string"){
            if(date=="")  date = new Date();
            else  date = new Date(date.replace(/-/g,"/"));
        }
        /*补00*/
        var toFixedWidth = function(value){
            var result = 100+value;
            return result.toString().substring(1);
        };

        /*配置*/
        var options = {
            regeExp:/(yyyy|M+|d+|h+|m+|s+|ee+|ws?|p)/g,
            months: ['January','February','March','April','May',
                'June','July', 'August','September',
                'October','November','December'],
            weeks: ['Sunday','Monday','Tuesday',
                'Wednesday','Thursday','Friday',
                'Saturday']
        };

        /*时间切换*/
        var swithHours = function(hours){
            return hours<12?"AM":"PM";
        };

        /*配置值*/
        var pattrnValue = {
            "yyyy":date.getFullYear(),                      //年份
            "MM":toFixedWidth(date.getMonth()+1),           //月份
            "dd":toFixedWidth(date.getDate()),              //日期
            "hh":toFixedWidth(date.getHours()),             //小时
            "mm":toFixedWidth(date.getMinutes()),           //分钟
            "ss":toFixedWidth(date.getSeconds()),           //秒
            "ee":options.months[date.getMonth()],           //月份名称
            "ws":options.weeks[date.getDay()],              //星期名称
            "M":date.getMonth()+1,
            "d":date.getDate(),
            "h":date.getHours(),
            "m":date.getMinutes(),
            "s":date.getSeconds(),
            "p":swithHours(date.getHours())
        };

        return pattern.replace(options.regeExp,function(){
            return  pattrnValue[arguments[0]];
        });
    };

})(jQuery);
(function($){
    $.fn.searchselect = function(options){
        var value = $.extend({},{
            divTip:'',
            width:200,
            height:30,
            radius:4,
            callback:function(){},
        },options);

        return this.each(function(){
            var _self = $(this);//input输入框
            var indexLi = 0;
            var id = _self.attr("id");
            var selftop = _self.offset().top;

            _self.css({
                "width":value.width,
                "height":value.height,
                "padding": "5px 10px",
                "border-radius": value.radius,
                "border": "1px solid #e4e4e4",
                "background": "url('/static/images4/back/searchselect.png?t=1') no-repeat",
                "background-position": "98% 50%",
                "background-size": "13px",
            });
            $(value.divTip).css({
                "position":"absolute",
                "top":value.height,
                "width":value.width,
                "max-height":400,
                "overflow":"auto",
                "background":"#fff",
                "border": "1px solid #e4e4e4",
                "z-index":100,
            });
            $(value.divTip).find("li").css({
                "padding": "5px 10px",
            });
            blus();

            $(document).unbind().click(function(event){
                if($(event.target).attr("id") == id){
                    if($(value.divTip).css("display") == "none"){
                        focus();
                    }else{
                        blus();
                    }
                }else{
                    if($(event.target).attr("class") == value.divTip || $(event.target).is(value.divTip+' li') || $(event.target).is(value.divTip+' li span')){
                        var liVal = $(event.target).text();
                        if($(event.target).is(value.divTip+' li span')){
                            liVal = $(event.target).parent("li").text();
                        }
                        if($(event.target).attr("data-count") != undefined){
                            _self.data("count",$(event.target).data("count"));
                        }
                        _self.val(liVal);
                    }else{
                        var valtext = _self.val();
                        var first = $(value.divTip).children().eq(0);

                        if(_self.val()==''){
                            _self.val(first.text());
                            _self.data("count",first.data("count"));
                        }else{
                            var temtext = true;
                            $(value.divTip).
                                children().
                                each(function(index) {
                                    var valAttr = $(this).text();
                                    if(valtext==valAttr){
                                        temtext = false;
                                    }
                                });
                            if(temtext){
                                _self.val(first.text());
                                _self.data("count",first.data("count"));
                            }
                        }
                    }
                    blus();
                    value.callback();
                }
            });

            //按键盘的上下移动LI的背景色
            _self.keydown(function(event){
                if(event.which == 38){//向上
                    keychange("up")
                }else if(event.which == 40){//向下
                    keychange()
                }else if(event.which == 13){ //回车
                    var eq = $(value.divTip).children().eq(indexLi);
                    var liVal = eq.text();
                    if(eq != undefined){
                        _self.data("count",eq.data("count"));
                    }
                    _self.val(liVal);
                    blus();
                    value.callback();
                }
            });

            //鼠标点击和悬停LI
            $(value.divTip).children().hover(function(){
                $(this).addClass("active").siblings().removeClass();
            });

            function blus(){
                $(value.divTip).hide();
                $(value.divTip).children().show();
            }

            function focus(){
                $(value.divTip).show();
            }

            function valChange(){
                var tex = _self.val();//输入框的值
                var reg = new RegExp(tex);


                //让提示层显示，并对里面的LI遍历
                if(_self.val()==""){
                    focus();
                    $(value.divTip).children().show();
                }else{
                    $(value.divTip).
                        show().
                        children().
                        hide().
                        each(function(index) {
                            var valAttr = $(this).text();
                            if(reg.test(valAttr)){
                                $(this).show();
                            }
                        })
                }
            }

            //输入框值发生改变的时候执行函数，这里的事件用判断处理浏览器兼容性;
            if($.browser.msie){
                $(this).bind("propertychange",function(){
                    valChange();
                })
            }else{
                $(this).bind("input",function(){
                    valChange();
                })
            }

            function keychange(up){
                if(up == "up"){
                    if(indexLi == 0){
                        indexLi = $(value.divTip).children().length - 1;
                    }else{
                        indexLi--;
                    }
                }else{
                    if(indexLi == $(value.divTip).children().length - 1){
                        indexLi = 0;
                    }else{
                        indexLi++;
                    }
                }
                $(value.divTip).children().eq(indexLi).addClass("active").siblings().removeClass("active");
            }
        });
    }
})(jQuery);
/**
 * 时间对象的格式化;
 */
if (!Date.prototype.format) {
    Date.prototype.format = function (format) {
        /*
         * eg:format="YYYY-MM-dd hh:mm:ss";
         */
        var o = {
            "M+": this.getMonth() + 1,
            // month
            "d+": this.getDate(),
            // day
            "h+": this.getHours(),
            // hour
            "m+": this.getMinutes(),
            // minute
            "s+": this.getSeconds(),
            // second
            "q+": Math.floor((this.getMonth() + 3) / 3),
            // quarter
            "S": this.getMilliseconds()
            // millisecond
        };

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };
}

if (!Array.indexOf) {
    Array.prototype.indexOf = function (obj) {
        var len = this.length;
        for (var i = 0; i < len; i++) {
            if (this[i] == obj) {
                return i;
            }
        }
        return -1;
    };
}

//
//if(!Array.remove){
//	Array.prototype.remove = function(obj){
//		var ind = this.indexOf(obj);
//		if(ind > -1){
//			this.splice(ind,1);
//		}
//	};
//}

$(document).ready(function () {
    /**
     * 定义placeholder函数,
     * 把所有input和textarea带有data-placeholder属性的元素能实现placeholder的功能.
     * 控件可以自己同时定义placeholder属性, 使用chrome的特性
     */
    (function ($) {
        $.fn.placeholder = function () {

            var placeholder = $(this).attr("data-placeholder");

            $(this).focus(function () {
                var val = $(this).val();
                if (val == placeholder) {
                    $(this).css('color', 'black').val('');
                }
            });

            $(this).blur(function () {
                var val = $.trim($(this).val());
                if (val == '') {
                    $(this).css('color', '#AEAEAE').val(placeholder);
                }
            });

            $(this).blur();
        };

        //若浏览器本身就支持placeholder则不必要做这种兼容,否则会出现对于带密码输入框holder内容被当作输入内容显示为密码
        if(!('placeholder' in document.createElement('input'))){
            // 初始化所有的input控件
            $("input[data-placeholder]").each(function (i) {
                $(this).placeholder();
            });
        }

        // 初始化所有的textarea控件
        $("textarea[data-placeholder]").each(function (i) {
            $(this).placeholder();
        });

    })(jQuery);

    /**
     * artdialog集成
     */
    (function ($) {
        $.fn.artdialog = function (options) {
            var opt = options || {};
            var $this = $(this);
            var position = $this.css('position');
            if (position == 'absolute') {
                $this.css('position', 'static');
            }
            opt.content = $this[0];
            if (art.dialog) {
                var dialog = art.dialog(opt);
                if (dialog) {
                    return dialog;
                }
            }
            return $this;
        };
    })(jQuery);

    /**
     * 自动完成控件
     */
    (function ($) {
        $.fn.autoComplete = function (cfg) {

            if (!cfg) {
                alert('[autoComplete]:missing cfg');
                return;
            }
            if (!cfg.url) {
                alert('[autoComplete]:missing url');
                return;
            }
            if (!cfg.parser) {
                alert('[autoComplete]:missing parser');
                return;
            }
            if (!cfg.callback) {
                alert('[autoComplete]:missing callback');
                return;
            }

            var input = $(this);

            if (input.length < 1) {
                return;
            }

            var url = cfg.url;
            var callback = cfg.callback;
            var parser = cfg.parser;
            var debug = cfg.debug;

            // container style
            var inputHeight = input.outerHeight();
            var inputWidth = input.outerWidth();

            var conFontSize = input.css('font-size');

            var conStyle = 'style="padding:5px 0;height:' + input.height() + ';font-size:' + conFontSize + ';cursor:pointer;border: 1px solid #D5D5D5;"';

            // var
            var container = null;
            var selecting = false;
            var selectTrs = null;
            var selectIndex = -1;

            // init
            init();

            // ready
            function init() {
                // 1.
                initContainer();
                // 2.
                initInput();
            }

            // about input
            function initInput() {
                input.blur(function () {
                    if (!selecting) {
                        container.empty();
                    }
                });
                input.keyup(function (event) {
                    var keyCode = event.which;
                    // enter
                    if (keyCode == 13) {
                        var value;
                        if (selectTrs && selectIndex >= 0) {
                            value = $(selectTrs[selectIndex]).attr('ak');
                        } else {
                            value = input.val();
                        }
                        docallback(value);
                    }
                    // up down
                    else if (keyCode == 38 || keyCode == 40) {
                        if (!selectTrs || selectTrs.length < 1) {
                            return;
                        }

                        var k = 0;
                        switch (keyCode) {
                            case 38:
                            {
                                if (selectIndex < 0) {
                                    k = selectTrs.length - 1;
                                } else {
                                    k = selectIndex - 1 < 0 ? selectTrs.length - 1 : selectIndex - 1;
                                }
                                break;
                            }
                            case 40:
                            {
                                if (selectIndex < 0) {
                                    k = 0;
                                } else {
                                    k = selectIndex + 1 >= selectTrs.length ? 0 : selectIndex + 1;
                                }
                                break;
                            }
                        }
                        if (selectIndex >= 0) {
                            $(selectTrs[selectIndex]).removeAttr('style');
                        }

                        $(selectTrs[k]).attr('style', 'background-color:#66B3FF;');
                        selectIndex = k;
                        input.val($(selectTrs[k]).attr('ak'));
                    }
                    // change
                    else {
                        if ('' == input.val()) {
                            selectTrs = null;
                            selectIndex = -1;
                            container.empty();
                            return;
                        }
                        // refresh
                        getData(url, input.val());
                    }
                });
                input.focus(function () {
                    // refresh
                    getData(url, input.val());
                });
            }

            // about container
            function initContainer() {
                var containerId = "autoComplete-container-" + new Date().getTime();
                $('body').append('<table id="' + containerId + '" style="position:absolute;background:white;border-collapse: collapse;"></table>');

                container = $('#' + containerId);
                container.width(inputWidth);

                container.css('left', input.offset().left - $(this).scrollLeft());
                container.css('top', input.offset().top + inputHeight - $(this).scrollTop());

                $(window).resize(function () {
                    container.css('left', input.offset().left - $(this).scrollLeft());
                    container.css('top', input.offset().top + inputHeight - $(this).scrollTop());
                });

                $(document).scroll(function () {
                    container.css('left', input.offset().left - $(this).scrollLeft());
                    container.css('top', input.offset().top + input.height() - $(this).scrollTop());
                });
            }

            // refresh container
            function refreshContainer(datas) {
                selectTrs = null;
                selectIndex = -1;
                container.empty();

                container.css('top', input.offset().top + inputHeight - $(this).scrollTop());

                if (!datas || datas.length == 0) {
                    return;
                }
                $.each(datas,
                    function (i) {
                        var val = parser(datas[i]);
                        container.append('<tr i="' + i + '" ak="' + val + '"><td ' + conStyle + '>' + val + '</td></tr>');
                    });

                selectTrs = container.find('tr');
                selectTrs.click(function () {
                    docallback($(this).attr('ak'));
                });
                selectTrs.mouseenter(function () {
                    selecting = true;
                    selectIndex = $(this).attr('i');
                    $(this).attr('style', 'background-color:#66B3FF;');
                });
                selectTrs.mouseleave(function () {
                    selecting = false;
                    selectIndex = -1;
                    $(this).removeAttr('style');
                });

            }

            // get data
            function getData(url, val) {
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: {
                        ak: val
                    },
                    dataType: 'json',
                    success: function (result) {
                        if (result.success) {
                            if (result.datas) {
                                refreshContainer(result.datas);
                            } else if (debug) {
                                alert('[autoComplete.getData]: no datas property of result');
                            }
                        } else if (debug) {
                            alert('[autoComplete.getData]:' + result.message);
                        }
                    },
                    error: function (xhr, status, error) {
                        if (debug) {
                            alert('[autoComplete.getData]:' + status);
                        }
                    }
                });
            }

            // do callback
            function docallback(val) {
                input.val(val);

                selectTrs = null;
                selectIndex = -1;

                container.empty();
                callback(val);
            }
        };

    })(jQuery);

    /**
     * 读写cookie的组件
     *
     */
    (function ($) {
        $.cookie = function (name, value, options) {
            if (typeof value != 'undefined') {
                options = options || {};
                if (value === null) {
                    value = '';
                    options = $.extend({},
                        options);
                    options.expires = -1;
                }
                var expires = '';
                if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                    var date;
                    if (typeof options.expires == 'number') {
                        date = new Date();
                        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                    } else {
                        date = options.expires;
                    }
                    expires = '; expires=' + date.toUTCString();
                }
                var path = options.path ? '; path=' + (options.path) : '';
                var domain = options.domain ? '; domain=' + (options.domain) : '';
                var secure = options.secure ? '; secure' : '';
                document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
            } else {
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = jQuery.trim(cookies[i]);
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
        };

    })(jQuery);

    /**
     * tips控件, 通过jQuery控件.tips(config)方法来调用 实现tips的功能. config:{
					 * backgroundColor: .. borderColor: .. content: .. renderTo:
					 * ... title: .. width: .. height: .. showOnLoad:.. }
     */
    (function ($) {

        $.fn.tips = function (config) {
            config = config || {};
            var $this = $(this);

            if ($this.length == 0) {
                return;
            }

            var content = config.content;
            if (!content) {
                return;
            }
            var title = config.title || "";
            var backgroudColor = config.backgroundColor || "#f9edbd";
            var borderColor = config.borderColor || "#f0c46d";
            var width = config.width || 150;
            var showOnLoad = config.showOnLoad || false;
            var container = $("<div style='font-size:12px;'></div>");

            var div = $("<div></div>");
            if (title) {
                div.append("<p style='margin-top:0px; margin-bottom:5px;'>" + title + "</p>");
                div.append("<hr style='margin:0;height:1px;border:0px;background-color:" + borderColor + ";' />");
            }
            div.append("<p style='margin:5px auto;'>" + content + "</p>");
            container.html(div.html());
            container.css('background-color', backgroudColor);
            container.css('border', '1px solid ' + borderColor);
            container.css('position', 'absolute');
            container.css('display', 'none');
            rePos();
            if (width != 'auto') {
                try {
                    width = parseInt(width);
                    container.css('width', width + "px");
                } catch (e) {
                }
            }
            container.css('padding-left', '10px');
            container.css('padding-right', '10px');
            container.css('z-index', '9999');
            // render到body
            $("body").append(container);
            var out = false;

            var hideTimer = null;

            container.hover(function () {
                    if (hideTimer) {
                        clearTimeout(hideTimer);
                        hideTimer = null;
                    }
                    rePos();
                    container.show();
                },
                function () {
                    hideTimer = setTimeout(function () {
                            container.hide();
                        },
                        100);
                });

            $this.hover(function () {
                    if (hideTimer) {
                        clearTimeout(hideTimer);
                        hideTimer = null;
                    }
                    rePos();
                    container.show();
                },
                function () {
                    hideTimer = setTimeout(function () {
                            container.hide();
                        },
                        100);
                });

            if (showOnLoad) {
                container.show();
            }

            $(window).resize(function () {
                rePos();
            });

            // TODO 对input控件的height要特殊处理.
            function rePos() {

                var realHeight = $this.outerHeight();

                var defaultTop = $this.offset().top + realHeight;

                container.css('top', defaultTop + "px");

                var defaultLeft = $this.offset().left - container.width() / 2 + $this.width() / 2;
                // 宿主靠右
                if ($(window).width() - $this.offset().left - $this.width() / 2 < container.width()) {
                    defaultLeft = defaultLeft - container.width() / 2 - 2;
                }

                // 宿主靠左
                if ($this.offset().left + $this.width() / 2 < container.width() / 2) {
                    defaultLeft = $(window).width() - container.width();
                }

                container.css('left', defaultLeft + "px");
            }

        };

        // 对于所有含有data-tip属性的控件都绑定这个事件.
        $("*[data-tip]").each(function (i) {
            var tip = $(this).attr('data-tip');
            if (tip) {
                $(this).tips({
                    content: tip,
                    width: "auto"
                });
            }
        });

        /**
         * 下拉列表 所有含有data-dropdown-id的元素, 而且其内容可以对应到另一个元素,
         * 则会将这个对应的元素作为下拉展示出来.
         */
        (function ($) {

            $.fn.dropDown = function () {
                var thisObj = $(this);
                var targetId = thisObj.attr("data-dropdown-id");
                var target = $("#" + targetId);
                if (!target || target.size() == 0) {
                    return;
                }

                var hideTimer = null;

                thisObj.hover(function () {

                        if (hideTimer) {
                            clearTimeout(hideTimer);
                        }

                        var thisHeight = thisObj.height();
                        var offset = thisObj.position();
                        target.css('position', 'absolute').css('left', offset.left + "px").css('top', (offset.top + thisHeight) + "px").css('border', '1px solid #CECECE').show();
                    },
                    function () {
                        hideTimer = setTimeout(function () {
                                target.hide();
                            },
                            100);
                    });

                target.hover(function () {
                        if (hideTimer) {
                            clearTimeout(hideTimer);
                        }
                        $(this).show();
                    },
                    function () {
                        hideTimer = setTimeout(function () {
                                target.hide();
                            },
                            200);
                    });

            };

            var allDropdownObj = $("*[data-dropdown-id]");
            allDropdownObj.each(function (i) {
                var inner = $(this);
                var id = inner.attr('data-dropdown-id');
                var target = $("#" + id);
                if (target && target.size() > 0) {
                    inner.dropDown();
                }
            });

        })(jQuery);

        /**
         * 让某工具栏在往下滚动时能固定住 参考淘宝的 商品详情的toolbar
         */
        (function ($) {
            $.fn.fixTopOnScroll = function () {
                var thisObj = $(this);
                if (thisObj.size() == 0) {
                    return;
                }
                var top = 0;
                var thisConfigTop = thisObj.attr('data-fix-top');
                var originalTop = thisObj.offset().top;
                var originalPosition = thisObj.css('position');
                var thisOuterHeight = thisObj.outerHeight();
                thisObj.css('z-index', '804');
                try {
                    top = parseInt(thisConfigTop);
                } catch (e) {
                }
                var ie6 = false;
                if ($.browser.msie && parseInt($.browser.version) == 6) {
                    ie6 = true;
                }

                if (top <= 0) {
                    return;
                }
                $(window).scroll(function () {
                    var currentScrTop = $(this).scrollTop();
                    if (currentScrTop > (originalTop - 130)) {
                        if (!ie6) {
                            thisObj.css('position', 'fixed').css('top', top + "px");
                        } else {
                            thisObj.css('position', 'relative').css('top', (currentScrTop - originalTop - 2) + "px");
                        }
                    } else {
                        thisObj.css('position', originalPosition);
                    }

                    // if(console &&
                    // console.log){
                    // console.log("[fixTopOnScroll]INFO
                    // scrollTop="+currentScrTop+"
                    // originalTop="+originalTop+"
                    // top="+top);
                    // }
                });

            };

            $("*[data-fix-top]").fixTopOnScroll();

        })(jQuery);

    })(jQuery);

    /**
     * 参数: config:{ left:... (number or "x%") top:... (number or
					 * "x%") width:... (number or "x%") height:... (number or
					 * "x%") iframe: ... (iframe src) fixed:... (true/false)
					 * title:... string closable:... true/false content:... html
					 * element / id / jQuery Obj not supported yet close:...
					 * function(){can call this.func} }
     *
     * 滑动面板控件
     */
    (function ($) {

        $.slidePanel = function ($config) {
            return new SlidePanel($config);
        };

        var SlidePanel = function ($config) {
            var self = this;
            var config = $config;
            var _close = null;
            self.backgroundColor = "rgb(245,245,245)";
            self.borderColor = "rgb(226,226,226)";

            var init = function () {
                config = config || {};
                self.left = config.left || 0;
                self.top = config.top || 0;
                self.width = config.width || "auto";
                self.height = config.height || "auto";
                self.iframe = config.iframe || "";
                self.fixed = config.fixed || false;
                self.title = config.title || "";
                self.closable = config.closable || false;
                self.content = config.content || "";
                /*
                 * self.loadingText = config.loadingText ||
                 * '数据加载中...';
                 */
                // 可以回调
                _close = config.close || null;
                if ($.browser.msie && parseInt($.browser.version) == 6) {
                    self.ie6 = true;
                }
                render();
                return this;
            };
            this.mainContent = null;

            var render = function () {
                if (self.iframe) {
                    self.mainContent = renderIframe();
                } else {
                    self.mainContent = renderHtml();
                }
                pos();
                self.show();
            };

            // 定位, 兼容ie6的fix
            var pos = function () {

                if (self.ie6) {
                    if (self.fixed == true) {
                        self.mainContent.css('position', 'absolute').css('top', (self.top + $(window).scrollTop()) + "px").css('left', self.left + "px");
                    } else {
                        self.mainContent.css('position', 'absolute').css('top', self.top + "px").css('left', self.left + "px");
                    }
                } else {
                    // this.mainContent.css('top',
                    // this.top+"px").css('left',this.left+"px");
                    if (self.fixed) {
                        self.mainContent.css('position', 'fixed').css('top', self.top + "px").css('left', self.left + "px");
                    } else {
                        self.mainContent.css('top', self.top + "px").css('left', self.left + "px");
                    }
                }

            };

            this.position = function (_top, _left) {
                this.top = _top;
                this.left = _left;
                pos();
            };

            this.hide = function () {
                this.mainContent.animate({
                        width: "0"
                    },
                    function () {
                        self.mainContent.hide();
                    });
            };

            this.close = function () {
                var closeResult = true;
                if (_close) {
                    closeResult = _close(this);
                } else {
                    this.hide();
                }
                if (typeof(closeResult) == 'undefined' || closeResult) {
                    this.mainContent.remove();
                }

            };

            this.setIframe = function (iframe) {
                this.iframe = iframe;
                // this.mainContent.find(".wk-slidepanel-loading").show().animate({
                // height: 20
                // });
                this.mainContent.find("iframe").contents().hide();
                this.mainContent.find("iframe").attr("src", iframe);
            };

            this.show = function () {
                this.mainContent.show();
                if (typeof(this.height) == 'string' && this.height.indexOf('%') == this.height.length - 1) {
                    this.mainContent.css('height', this.height);
                }
                this.mainContent.animate({
                        width: this.width
                    },
                    200);
            };

            var renderIframe = function () {
                var main = $("<div style='display:none;'></div>");
                main.css('border', '1px solid ' + self.borderColor).css('background-color', self.backgroundColor).css('height', self.height + "px").css('width', '0px');
                var top4close = $("<div style='font-size:20px; color:rgb(137,137,137)'></div>");
                top4close.css('margin-top', '10px');
                if (self.title) {
                    var title = $("<span style='font-weight:bold; color:black;'>" + self.title + "</span>");
                    title.css('float', 'left').css('margin-left', '20px').css('font-size', '14px').css('line-height', '27px').css('height', '27px');
                    top4close.append(title);
                }
                var panel = self;

                if (self.closable) {
                    var closeHack = $("<span title='关闭' >×</span>");
                    closeHack.css('float', 'right').css('margin-right', '5px').css('color', 'rgb(137,137,137').css('cursor', 'pointer').css('margin-top', '-10px');

                    closeHack.click(function () {
                        panel.close();
                    });
                    top4close.append(closeHack).append("<div style='clear:both;'></div>");
                    main.append(top4close);
                }
                var content = $("<div></div>");
                // var loading = $("<div
                // class='wk-slidepanel-loading' >" +
                // self.loadingText + "</div>");
                // loading.css("margin", "10px");
                // content.append(loading);
                var ifr = $('<iframe frameborder="0" style="border:0px; width:100%;" src="' + self.iframe + '" ></iframe>');
                ifr.load(function () {
                    // loading.animate({
                    // height: 0
                    // },
                    // 500,
                    // function() {
                    // $(this).hide();
                    // });
                    this.height = $(this).contents().height();

                    // 如果是百分号, 则不需要
                    if (typeof(panel.height) == 'string' && panel.height.indexOf('%') == panel.height.length - 1) {
                        panel.mainContent.css('height', panel.height);
                        this.height = panel.mainContent.height() - 40;
                        var ifr = this;
                        // 根据当前heiht调整ifr大小
                        $(window).resize(function (event) {
                            ifr.height = panel.mainContent.height() - 40;
                        });

                    } else {
                        panel.height = this.height;
                        panel.mainContent.height($(this).contents().height() + 60);
                    }

                    if (panel.fixed === true) {
                        // 滚动事件
                        if (panel.ie6) {
                            var scrollTimeout = null;
                            panel.mainContent.css('position', 'absolute');
                            $(window).scroll(function () {
                                if (scrollTimeout) {
                                    clearTimeout(scrollTimeout);
                                }
                                var scrolls = $(this).scrollTop();
                                scrollTimeout = setTimeout(function () {
                                        panel.mainContent.animate({
                                                top: panel.top + scrolls
                                            },
                                            500,
                                            function () {
                                                scrollTimeout = null;
                                            });

                                    },
                                    300);

                            });
                        } else {
                            panel.mainContent.css('position', 'fixed').css('top', panel.top + 'px');
                        }

                    }
                    $(window).resize();
                });
                content.append(ifr);
                main.append(content);
                $("body").append(main);
                return main;
            };

            var renderHtml = function () {
                var main = $("<div style='display:none;'></div>");
                main.css('border', '1px solid ' + self.borderColor).css('background-color', self.backgroundColor).css('height', self.height + "px").css('width', '0px');
                var top4close = $("<div style='font-size:20px; color:rgb(137,137,137)'></div>");
                top4close.css('margin-top', '10px');
                if (self.title) {
                    var title = $("<span style='font-weight:bold; color:black;'>" + self.title + "</span>");
                    title.css('float', 'left').css('margin-left', '20px').css('font-size', '14px').css('line-height', '27px').css('height', '27px');
                    top4close.append(title);
                }
                if (self.closable) {
                    var closeHack = $("<span title='关闭' >×</span>");
                    closeHack.css('float', 'right').css('margin-right', '5px').css('color', 'rgb(137,137,137').css('cursor', 'pointer').css('margin-top', '-10px');
                    var panel = self;
                    closeHack.click(function () {
                        panel.close();
                    });
                    top4close.append(closeHack).append("<div style='clear:both;'></div>");

                }
                main.append(top4close);
                var content = $("<div></div>");
                content.append(self.content);
                main.append(content);
                var selfContent = $(self.content);
                var width = selfContent.outerWidth();
                // var paddingLeft =
                // selfContent.css('padding-left');
                // var paddingRight =
                // selfContent.css('padding-right');
                // if(paddingLeft && paddingLeft.indexOf('px') >
                // 0){
                // width +=
                // parseInt(paddingLeft.substring(0,paddingLeft.length
                // - 2));
                // }
                //
                // if(paddingRight && paddingRight.indexOf('px')
                // > 0){
                // width +=
                // parseInt(paddingRight.substring(0,paddingRight.length
                // - 2));
                // }
                if (self.fixed === true) {
                    // 滚动事件
                    if (self.ie6) {
                        var scrollTimeout = null;
                        main.css('position', 'absolute');
                        $(window).scroll(function () {
                            if (scrollTimeout) {
                                clearTimeout(scrollTimeout);
                            }
                            var scrolls = $(this).scrollTop();
                            scrollTimeout = setTimeout(function () {
                                    main.animate({
                                            top: self.top + scrolls
                                        },
                                        500,
                                        function () {
                                            scrollTimeout = null;
                                        });

                                },
                                300);

                        });
                    } else {
                        main.css('position', 'fixed').css('top', self.top + 'px');
                    }

                }
                $(window).resize();
                $("body").append(main);
                self.width = width;
                main.css('width', width + "px");
                return main;
            };
            init();
            return this;
        };

    })(jQuery);

});

/**
 * 翻页、搜索函数
 */
(function (window) {

    var WK = ({

        // 条件筛选
        search: function (querys, url) {
            if (!querys) {
                alert('请选择条件');
                return false;
            }
            if (!url) {
                url = window.location.href.split('?')[0];
            }
            var query = "?";
            var startFlag = 0;
            $.each(querys,
                function (i, v) {
                    var obj = $(v);
                    // 过滤checked box
                    if ("checkbox" == obj.attr('type') && !obj.attr('checked')) {
                        // ignore
                    } else {
                        if (startFlag == 0) {
                            query += obj.attr('name') + '=' + encodeURI(obj.val(), "utf-8");
                        } else {
                            query += '&' + obj.attr('name') + '=' + encodeURI(obj.val(), "utf-8");
                        }
                        startFlag++;
                    }
                });
            window.location.href = url + query;
        },

        // 翻页
        page: function (key, val, url, open) {

            if (!url) {
                url = window.location.href;
            }
            var urlarray = url.split('?');
            var targetUrl = urlarray[0] + '?';

            if (targetUrl.indexOf('#') > -1) {
                targetUrl = targetUrl.substring(0, targetUrl.indexOf('#'));
            }

            if (urlarray.length > 1) {

                var paras = urlarray[1].split('&');
                for (var i = 0; i < paras.length; i++) {

                    if ('' == paras[i]) {
                        continue;
                    }
                    if (paras[i].split('=')[0] == key) {
                        continue;
                    }
                    if (i > 0) {
                        targetUrl += '&';
                    }
                    targetUrl += paras[i];
                }
                targetUrl += '&';
            }

            targetUrl += key + '=' + val;

            if (typeof(_uqid) != 'undefined') {
                targetUrl += '&_uqid=' + _uqid;
            }

            if (open) {
                window.open(targetUrl);
            } else {
                window.location.href = targetUrl;
            }

        },

        pageurl: function (key, val, url) {
            if (!url) {
                url = window.location.href;
            }
            var urlarray = url.split('?');
            var targetUrl = urlarray[0] + '?';

            if (urlarray.length > 1) {

                var paras = urlarray[1].split('&');
                for (var i = 0; i < paras.length; i++) {

                    if ('' == paras[i]) {
                        continue;
                    }
                    if (paras[i].split('=')[0] == key) {
                        continue;
                    }
                    if (i > 0) {
                        targetUrl += '&';
                    }
                    targetUrl += paras[i];
                }
                targetUrl += '&';
            }

            targetUrl += key + '=' + val;
            return targetUrl;
        },

        // 营销关键词检查
        marketDict: function (content, callback) {
            var match = [];
            if (content && content != '') {
                var dict = '回馈,优惠,让利,专线,折上折,预约,直销,大礼,会员,打折,折扣,代金券,购物,折优惠,百万豪礼,派送,详询,奖品,卡号,积分,百分百中,尊敬的,咨询,民航,热线,温馨提示,酬宾,抢购,额满,电询,付款,全场,巨惠,精装,特惠,限购,超!低!,超低,超省,优惠,抽奖,大型促,店内消费,店庆,额外惊喜,疯狂,疯抢,更享,豪礼,回赠,仅限,款式多多,狂送,立返,立减,免费,秒杀,特卖'.split(',');
                for (var i = 0; i < dict.length; i++) {
                    if (content.indexOf(dict[i]) > -1 && match.indexOf(dict[i]) < 0) {
                        match.push(dict[i]);
                    }
                }
            }
            if (callback) {
                callback(match);
            }
            return match;
        },

        // 变量检查
        varValidate: function (content, $callback, type) {

            var defaultDictMap = {
                "1": ["收货人", "运单号", "物流公司", "旺旺", "订单号"],
                "2": ["收货人", "旺旺"],
                "3": ["收货人"],
                "13": ["收货人"],
                "20": ["收货人", "旺旺", "订单号"],
                //旺旺 和城市都不要判断
                "16": ["收货人", "运单号", "物流公司", "旺旺", "城市"],
                "19": ["收货人", "旺旺"],
                "17": ["收货人", "旺旺"],
                "18": ["收货人", "旺旺"],
                "15": ["收货人", "旺旺"],
                "28": ["收货人", "旺旺"],
                "29": ["收货人", "旺旺"],
                "31": ["收货人", "当前等级", "旺旺"],
                "32": ["收货人", "当前等级", "旺旺"],
                "33": ["收货人", "当前等级", "旺旺"],
                "34": ["收货人", "当前等级", "旺旺"]
            };

            //从全局读取, 兼容老代码
            var type = (type || window.type) + "";
            var dict = defaultDictMap[type] || ["收货人", "旺旺"];
            var callback = $callback;

            //判断其他类型有的变量而当前类型不支持, 这里要提示用修改变量
            var varRegExp = new RegExp('#([a-zA-Z0-9\\u4e00-\\u9fa5]+)#', 'g');
            for (; ;) {
                var exec = varRegExp.exec(content);
                if (null == exec || exec.length < 2) {
                    break;
                }
                if (dict.indexOf(exec[1]) < 0) {
                    alert("当前短信不支持 " + exec[0] + " 变量，请修改！");
                    return false;
                }
            }

            for (var key in defaultDictMap) {
                if (key != type) {
                    var value = defaultDictMap[key];
                    for (var i = 0; i < value.length; i++) {
                        var td = value[i];
                        var tdf = '#' + td + '#';
                        //当前类型不包含的变量, 而且其他类型包含的话, 需要提示不支持
                        if (dict.indexOf(td) < 0 && content.indexOf(tdf) >= 0) {
                            alert("当前短信类型不支持 " + tdf + " 变量，请修改！");
                            return false;
                        }
                    }
                }
            }

            //变量填写错误检查
            if (!WK.result || !WK.result['var.error.uncheck']) {
                for (var i = 0; i < dict.length; i++) {
                    var td = dict[i];
                    var tdf = '#' + td + '#';
                    if (content.indexOf(td) > -1 && content.indexOf(tdf) < 0 && (td != '旺旺' && td != '城市')) {

                        art.dialog({
                            title: '提示',
                            content: "变量 " + td + " 填写错误：正确格式为 " + tdf,
                            lock: true,
                            okVal: '我知道了',
                            ok: function () {
                                WK.result = WK.result || {};
                                WK.result['var.error.uncheck'] = true;
                                callback();
                            },
                            cancelVal: '返回修改',
                            cancel: function () {

                            }
                        });

                        return false;
                    }
                }
            } else {
                //callback();
            }

            //			var defaultVarDict = {
            //				"#收货人#" : 1,
            //				"#物流公司#" : 1,
            //				"#运单号#" : 1,
            //				"#城市#" : 1,
            //				"#当前等级#" : 1,
            //				"#旺旺#" : 1
            //			};
            //			var reg = new RegExp("(#[^#]+#)", "gm");
            //			var ind = 0;
            //			for (;;) {
            //				ind++;
            //				var res = reg.exec(content);
            //				if (null == res || ind >= 10 || res.length < 1) {
            //					break;
            //				}
            //				if (!defaultVarDict[res[0]]) {
            //					alert("变量填写错误：" + res[0]);
            //					return false;
            //				}
            //			}
            return true;
        },

        // 时间判断
        inDate: function ($date, $month, $year) {
            var date = new Date();

            if ($date && date.getDate() > $date) {
                return false;
            }

            if ($month && date.getMonth() > ($month - 1)) {
                return false;
            }

            if ($year && date.getYear() > ($year - 1900)) {
                return false;
            }

            return true;
        },

        // 新版翻页，推荐使用
        newpage: function (config) {

            var url = config.url || window.location.href;
            var open = config.open || false;
            var data = config.data || {};
            var reset = config.reset || false;
            var remove = config.remove || [];

            var urlarray = url.split('?');
            var query = {};

            if (!reset && urlarray.length > 1) {

                var paras = urlarray[1].split('&');
                for (var i = 0; i < paras.length; i++) {

                    var kv = paras[i].split('=');
                    if (kv.length != 2 || kv[0] == '') {
                        continue;
                    }
                    query[kv[0]] = kv[1];
                }
            }

            // merge
            for (var inx in data) {
                query[inx] = data[inx];
            }

            // generate target url
            var targetUrl = urlarray[0].split('#')[0] + '?';
            var i = 0;

            for (var inx in query) {

                var rm = false;
                //remove
                for (var j = 0; j < remove.length; j++) {
                    if (remove[j] == inx) {
                        rm = true;
                        break;
                    }
                }
                if (rm) {
                    continue;
                }

                if (i > 0) {
                    targetUrl += '&';
                }
                targetUrl += inx + '=' + query[inx];
                i++;
            }

            targetUrl = targetUrl.replace(/#/g, '');

            if (typeof(_uqid) != 'undefined') {
                targetUrl += '&_uqid=' + _uqid;
            }

            if (open) {
                window.open(targetUrl);
            } else {
                window.location.href = targetUrl;
            }
        },

        dopage: function ($data, input) {

            var data = {};

            if (input) {
                var obj = $(input);

                var name = obj.attr('name');
                var type = obj.attr('type');
                var value = obj.attr('value');

                if ('checkbox' == type) {
                    data[name] = obj.attr('checked') == 'checked';
                } else {
                    data[name] = value;
                }
            }

            if ($data) {
                for (var k in $data) {
                    data[k] = $data[k];
                }
            }

            WK.newpage({
                data: data
            });
        },

        parseFields: function (fields) {
            var data = {};
            for (var i = 0; i < fields.length; i++) {
                var obj = $(fields[i]);
                var name = obj.attr('name');
                var val = obj.val();
                var type = obj.attr('type');

                if (type == 'radio') {
                    if (!obj.is(':checked')) {
                        continue;
                    }
                    val = obj.val();
                }

                else if (type == 'checkbox') {
                    val = obj.attr('checked') == 'checked';
                }

                if (null == val) {
                    val = '';
                }

                // radio and so on
                data[name] = val;
            }
            return data;
        },

        post: function (opt, url, data, ok, error) {
            if (data) {
                if (typeof(_uqid) != 'undefined') {
                    data['_uqid'] = _uqid;
                }
                data._timestamp = new Date().getTime();
            }
            $.ajax({
                type: 'POST',
                url: url,
                dataType: 'json',
                data: data,
                success: function (result) {
                    if (result.success) {
                        ok(result);
                    } else {
                        alert(result.message);
                    }
                },
                error: function (xhr, status, e) {
                    if (error) {
                        error(status);
                    }

                    else {
                        alert('您的停留时间过长，请刷新页面后重试。');
                    }
                }
            });
        },

        newpost: function (opt, url, data, ok, error) {
            if (data) {
                if (typeof(_uqid) != 'undefined') {
                    data['_uqid'] = _uqid;
                }
                data['_timestamp'] = new Date().getTime();
            }
            $.ajax({
                type: 'POST',
                url: url,
                dataType: 'json',
                data: data,
                success: function (result) {
                    ok(result);
                },
                error: function (xhr, status, e) {
                    if (error) {
                        error(status);
                    }

                    else {
                        // alert('您的停留时间过长，请刷新页面后重试。');
                    }
                }
            });
        },

        posUtil: {

            /**
             * 获取输入光标在页面中的坐标
             *
             * @param {HTMLElement}
             *            输入框元素
             * @return {Object} 返回left和top,bottom
             */
            getInputPositon: function (elem) {
                if (document.selection) { // IE Support
                    elem.focus();
                    var Sel = document.selection.createRange();
                    return {
                        left: Sel.boundingLeft,
                        top: Sel.boundingTop,
                        bottom: Sel.boundingTop + Sel.boundingHeight
                    };
                } else {
                    var that = this;
                    var cloneDiv = '{$clone_div}',
                        cloneLeft = '{$cloneLeft}',
                        cloneFocus = '{$cloneFocus}',
                        cloneRight = '{$cloneRight}';
                    var none = '<span style="white-space:pre-wrap;"> </span>';
                    var div = elem[cloneDiv] || document.createElement('div'),
                        focus = elem[cloneFocus] || document.createElement('span');
                    var text = elem[cloneLeft] || document.createElement('span');
                    var offset = that._offset(elem),
                        index = this._getFocus(elem),
                        focusOffset = {
                            left: 0,
                            top: 0
                        };

                    if (!elem[cloneDiv]) {
                        elem[cloneDiv] = div,
                            elem[cloneFocus] = focus;
                        elem[cloneLeft] = text;
                        div.appendChild(text);
                        div.appendChild(focus);
                        document.body.appendChild(div);
                        focus.innerHTML = '|';
                        focus.style.cssText = 'display:inline-block;width:0px;overflow:hidden;z-index:-100;word-wrap:break-word;word-break:break-all;';
                        div.className = this._cloneStyle(elem);
                        div.style.cssText = 'visibility:hidden;display:inline-block;position:absolute;z-index:-100;word-wrap:break-word;word-break:break-all;overflow:hidden;';
                    }

                    var thisOff = this._offset(elem);

                    div.style.left = thisOff.left + "px";
                    div.style.top = thisOff.top + "px";
                    var strTmp = elem.value.substring(0, index).replace(/</g, '<').replace(/>/g, '>').replace(/\n/g, '<br/>').replace(/\s/g, none);
                    text.innerHTML = strTmp;

                    focus.style.display = 'inline-block';
                    try {
                        focusOffset = this._offset(focus);
                    } catch (e) {
                    }

                    focus.style.display = 'none';
                    return {
                        left: focusOffset.left,
                        top: focusOffset.top,
                        bottom: focusOffset.bottom,
                        act: 0 != thisOff.left || 0 != thisOff.top
                    };
                }
            },

            // 克隆元素样式并返回类
            _cloneStyle: function (elem, cache) {
                if (!cache && elem['${cloneName}']) return elem['${cloneName}'];
                var className, name, rstyle = /^(number|string)$/;
                var rname = /^(content|outline|outlineWidth)$/; // Opera:
                // content;
                // IE8:outline
                // && outlineWidth
                var cssText = [],
                    sStyle = elem.style;

                for (name in sStyle) {
                    if (!rname.test(name)) {
                        val = this._getStyle(elem, name);
                        if (val !== '' && rstyle.test(typeof val)) { // Firefox
                            // 4
                            name = name.replace(/([A-Z])/g, "-$1").toLowerCase();
                            cssText.push(name);
                            cssText.push(':');
                            cssText.push(val);
                            cssText.push(';');
                        }
                    }
                }
                cssText = cssText.join('');
                elem['${cloneName}'] = className = 'clone' + (new Date).getTime();
                this._addHeadStyle('.' + className + '{' + cssText + '}');
                return className;
            },

            // 向页头插入样式
            _addHeadStyle: function (content) {
                var style = this._style[document];
                if (!style) {
                    style = this._style[document] = document.createElement('style');
                    document.getElementsByTagName('head')[0].appendChild(style);
                }

                style.styleSheet && (style.styleSheet.cssText += content) || style.appendChild(document.createTextNode(content));
            },

            _style: {},

            // 获取最终样式
            _getStyle: 'getComputedStyle' in window ?
                function (elem, name) {
                    return getComputedStyle(elem, null)[name];
                } : function (elem, name) {
                return elem.currentStyle[name];
            },

            // 获取光标在文本框的位置
            _getFocus: function (elem) {
                var index = 0;
                if (document.selection) { // IE Support
                    elem.focus();
                    var Sel = document.selection.createRange();
                    if (elem.nodeName === 'TEXTAREA') { // textarea
                        var Sel2 = Sel.duplicate();
                        Sel2.moveToElementText(elem);
                        index = -1;
                        while (Sel2.inRange(Sel)) {
                            Sel2.moveStart('character');
                            index++;
                        }
                    } else if (elem.nodeName === 'INPUT') { // input
                        Sel.moveStart('character', -elem.value.length);
                        index = Sel.text.length;
                    }
                } else if (elem.selectionStart || elem.selectionStart == '0') { // Firefox
                    // support
                    index = elem.selectionStart;
                }
                return index;
            },

            // 获取元素在页面中位置
            _offset: function (elem) {
                var box = elem.getBoundingClientRect(),
                    doc = elem.ownerDocument,
                    body = doc.body,
                    docElem = doc.documentElement;
                var clientTop = docElem.clientTop || body.clientTop || 0,
                    clientLeft = docElem.clientLeft || body.clientLeft || 0;
                var top = box.top + (self.pageYOffset || docElem.scrollTop) - clientTop,
                    left = box.left + (self.pageXOffset || docElem.scrollLeft) - clientLeft;
                return {
                    left: left,
                    top: top,
                    right: left + box.width,
                    bottom: top + box.height
                };
            }
        }

    });

    // 全局变量
    window.WK = WK;

})(window);

$.fn.extend({
    getCurPos: function () {
        var e = $(this).get(0);
        e.focus();
        if (e.selectionStart) { // FF
            return e.selectionStart;
        }
        if (document.selection) { // IE
            var r = document.selection.createRange();
            if (r == null) {
                return e.value.length;
            }
            var re = e.createTextRange();
            var rc = re.duplicate();
            re.moveToBookmark(r.getBookmark());
            rc.setEndPoint('EndToStart', re);
            return rc.text.length;
        }
        return e.value.length;
    }
});

//支持背景颜色的animate效果,从jquery ui core 提取的
(function (d) {
    d.each(["backgroundColor", "borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor", "color", "outlineColor"],
        function (f, e) {
            d.fx.step[e] = function (g) {
                if (!g.colorInit) {
                    g.start = c(g.elem, e);
                    g.end = b(g.end);
                    g.colorInit = true
                }
                g.elem.style[e] = "rgb(" + [Math.max(Math.min(parseInt((g.pos * (g.end[0] - g.start[0])) + g.start[0]), 255), 0), Math.max(Math.min(parseInt((g.pos * (g.end[1] - g.start[1])) + g.start[1]), 255), 0), Math.max(Math.min(parseInt((g.pos * (g.end[2] - g.start[2])) + g.start[2]), 255), 0)].join(",") + ")"
            }
        });
    function b(f) {
        var e;
        if (f && f.constructor == Array && f.length == 3) {
            return f
        }
        if (e = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(f)) {
            return [parseInt(e[1]), parseInt(e[2]), parseInt(e[3])]
        }
        if (e = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(f)) {
            return [parseFloat(e[1]) * 2.55, parseFloat(e[2]) * 2.55, parseFloat(e[3]) * 2.55]
        }
        if (e = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(f)) {
            return [parseInt(e[1], 16), parseInt(e[2], 16), parseInt(e[3], 16)]
        }
        if (e = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(f)) {
            return [parseInt(e[1] + e[1], 16), parseInt(e[2] + e[2], 16), parseInt(e[3] + e[3], 16)]
        }
        if (e = /rgba\(0, 0, 0, 0\)/.exec(f)) {
            return a.transparent
        }
        return a[d.trim(f).toLowerCase()]
    }

    function c(g, e) {
        var f;
        do {
            f = d.css(g, e);
            if (f != "" && f != "transparent" || d.nodeName(g, "body")) {
                break
            }
            e = "backgroundColor"
        } while (g = g.parentNode);
        return b(f)
    }

    var a = {
        aqua: [0, 255, 255],
        azure: [240, 255, 255],
        beige: [245, 245, 220],
        black: [0, 0, 0],
        blue: [0, 0, 255],
        brown: [165, 42, 42],
        cyan: [0, 255, 255],
        darkblue: [0, 0, 139],
        darkcyan: [0, 139, 139],
        darkgrey: [169, 169, 169],
        darkgreen: [0, 100, 0],
        darkkhaki: [189, 183, 107],
        darkmagenta: [139, 0, 139],
        darkolivegreen: [85, 107, 47],
        darkorange: [255, 140, 0],
        darkorchid: [153, 50, 204],
        darkred: [139, 0, 0],
        darksalmon: [233, 150, 122],
        darkviolet: [148, 0, 211],
        fuchsia: [255, 0, 255],
        gold: [255, 215, 0],
        green: [0, 128, 0],
        indigo: [75, 0, 130],
        khaki: [240, 230, 140],
        lightblue: [173, 216, 230],
        lightcyan: [224, 255, 255],
        lightgreen: [144, 238, 144],
        lightgrey: [211, 211, 211],
        lightpink: [255, 182, 193],
        lightyellow: [255, 255, 224],
        lime: [0, 255, 0],
        magenta: [255, 0, 255],
        maroon: [128, 0, 0],
        navy: [0, 0, 128],
        olive: [128, 128, 0],
        orange: [255, 165, 0],
        pink: [255, 192, 203],
        purple: [128, 0, 128],
        violet: [128, 0, 128],
        red: [255, 0, 0],
        silver: [192, 192, 192],
        white: [255, 255, 255],
        yellow: [255, 255, 0],
        transparent: [255, 255, 255]
    }
})(jQuery);

jQuery.fn.bghighlight = function (opt) {
    var opt = opt || {};
    var color = opt.color || "#FFFDD2";
    var speed = opt.speed || 800;
    var thisObj = $(this);
    var originalBGC = thisObj.css('background-color');
    thisObj.animate({
            backgroundColor: color
        },
        speed,
        function () {
            //setTimeout(function(){
            //	thisObj.animate({backgroundColor: originalBGC}, speed);
            //}, 1500);
        });
    return this;
};

jQuery.fn.highlight = function (pat) {
    function innerHighlight(node, pat) {
        var skip = 0;
        if (node.nodeType == 3) {
            var pos = node.data.toUpperCase().indexOf(pat);
            if (pos >= 0) {
                var spannode = document.createElement('span');
                spannode.className = 'highlight';
                var middlebit = node.splitText(pos);
                var endbit = middlebit.splitText(pat.length);
                var middleclone = middlebit.cloneNode(true);
                spannode.appendChild(middleclone);
                middlebit.parentNode.replaceChild(spannode, middlebit);
                skip = 1;
            }
        } else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
            for (var i = 0; i < node.childNodes.length; ++i) {
                i += innerHighlight(node.childNodes[i], pat);
            }
        }
        return skip;
    }

    return this.length && pat && pat.length ? this.each(function () {
        innerHighlight(this, pat.toUpperCase());
    }) : this;
};

jQuery.fn.removeHighlight = function () {
    return this.find("span.highlight").each(function () {
        this.parentNode.firstChild.nodeName;
        with (this.parentNode) {
            replaceChild(this.firstChild, this);
            normalize();
        }
    }).end();
};

(function (jQuery) {

    jQuery.fn.toEditableField = function (config) {

        var _this = $(this);
        var editables = _this.find(".editable");
        var settingBtn;
        var cancelBtn;
        var saveBtn;
        var isSave = false;
        var originData = [];

        var config = config || {};
        this.hide = null;

        //
        var log = function (cnt) {
            try {
                if (console && console.log) {
                    console.log(cnt);
                }
            } catch (e) {
                //
            }
        }

        function init() {

            //没有字段
            if (editables.size() < 1) {
                log("[WARN] - toEditableField - there's no editable field!");
                return;
            }

            //新增几个按钮
            settingBtn = $("<a href='###' style='color:rgb(0,84,166);'>设置</a>");
            saveBtn = $("<a href='###' style='color:rgb(0,84,166); '>保存</a>");
            cancelBtn = $("<a href='###' style='color:rgb(0,84,166);'>取消</a>");

            settingBtn.click(setting);
            saveBtn.click(save);
            cancelBtn.click(cancel);

            _this.append('<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>');
            _this.append(settingBtn);
            _this.append(saveBtn);
            _this.append('<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>');
            _this.append(cancelBtn);
            saveBtn.hide();
            cancelBtn.hide();
            this.hide = cancel;
        }

        function setting() {
            //把那些editable的field都转换成input
            originData = [];

            var esize = editables.size();

            if (esize > 0) {

                editables.each(function (index) {

                    var cur = $(this);

                    var name = cur.attr('name');

                    if (!name) {
                        name = "" + index;
                    }

                    var width = cur.innerWidth();
                    if (width < 10) {
                        width = 10;
                    }

                    var text = $.trim(cur.text());
                    var fontSize = _this.css('font-size');

                    originData.push(text);

                    var input = $('<input style="width:' + width + 'px;height:' + fontSize + ';" class="editable-input"  name="' + name + '"/>');
                    input.val(text);
                    //彩蛋, 最后一个输入框时回车可以保存.
                    if (esize - 1 == index) {
                        input.keyup(function (event) {
                            if (event.which == 13) {
                                save();
                            }
                        });
                    }

                    cur.html(input);
                    if (index == 0) {
                        cur.focus();
                    }
                });

                settingBtn.hide();
                saveBtn.show();
                cancelBtn.show();
                $(_this.find(".editable-input")[0]).focus();
            } else {
                log("[WARN] - toEditableField - there's no editable field!");
            }
        }

        function save() {

            var callback = config.onsave;

            if (!callback || typeof(callback) != 'function') {

                log('[ERROR] callback not exist or not a function! see usage');
                return;
            }

            var data = {};
            var inputs = _this.find(".editable-input");
            inputs.each(function (i) {
                var cur = $(this);
                var val = cur.val();
                var name = cur.attr('name');
                data[name] = val;
            });

            //交給使用方去验证
            var callbackResult = callback(data);

            //如果他返回false, 就不用cancel了
            if (typeof(callbackResult) == 'boolean' && callbackResult == false) {
                return;
            }

            originData = [];
            for (var key in data) {
                originData.push(data[key]);
            }

            cancel();
        }

        function cancel() {
            var fields = _this.find(".editable");
            fields.each(function (index) {

                var cur = $(this);

                var inputOfCur = cur.find('.editable-input');

                cur.html(originData[index]);

                saveBtn.hide();
                cancelBtn.hide();
                settingBtn.show();
            });
        }

        init();
    }

})($);

(function (jQuery) {
    var map = {
        "北京": ["北京市"],
        "上海": ["上海市"],
        "广东省": ["全省", "广州市", "深圳市", "珠海市", "汕头市", "韶关市", "佛山市", "江门市", "湛江市", "茂名市", "肇庆市", "惠州市", "梅州市", "汕尾市", "河源市", "阳江市", "清远市", "东莞市", "中山市", "潮州市", "揭阳市", "云浮市"],
        "浙江省": ["全省", "杭州市", "宁波市", "温州市", "嘉兴市", "湖州市", "绍兴市", "金华市", "衢州市", "舟山市", "台州市", "丽水市"],
        "江苏省": ["全省", "南京市", "无锡市", "徐州市", "常州市", "苏州市", "南通市", "连云港市", "淮安市", "盐城市", "扬州市", "镇江市", "泰州市", "宿迁市"],
        "天津": ["天津市"],
        "重庆": ["重庆市"],
        "陕西省": ["全省", "西安市", "铜川市", "宝鸡市", "咸阳市", "渭南市", "延安市", "汉中市", "榆林市", "安康市", "商洛市"],
        "河南省": ["全省", "郑州市", "开封市", "洛阳市", "平顶山市", "安阳市", "鹤壁市", "新乡市", "焦作市", "濮阳市", "许昌市", "漯河市", "三门峡市", "南阳市", "商丘市", "信阳市", "周口市", "驻马店市", "济源市"],
        "江西省": ["全省", "南昌市", "景德镇市", "萍乡市", "九江市", "新余市", "鹰潭市", "赣州市", "吉安市", "宜春市", "抚州市", "上饶市"],
        "吉林省": ["全省", "长春市", "吉林市", "四平市", "辽源市", "通化市", "白山市", "松原市", "白城市", "延边朝鲜族自治州"],
        "安徽省": ["全省", "合肥市", "芜湖市", "蚌埠市", "淮南市", "马鞍山市", "淮北市", "铜陵市", "安庆市", "黄山市", "滁州市", "阜阳市", "宿州市", "巢湖市", "六安市", "亳州市", "池州市", "宣城市"],
        "四川省": ["全省", "成都市", "自贡市", "攀枝花市", "泸州市", "德阳市", "绵阳市", "广元市", "遂宁市", "内江市", "乐山市", "南充市", "眉山市", "宜宾市", "广安市", "达州市", "雅安市", "巴中市", "资阳市", "阿坝藏族羌族自治州", "甘孜藏族自治州", "凉山彝族自治州"],
        "河北省": ["全省", "石家庄市", "唐山市", "秦皇岛市", "邯郸市", "邢台市", "保定市", "张家口市", "承德市", "沧州市", "廊坊市", "衡水市"],
        "福建省": ["全省", "福州市", "厦门市", "莆田市", "三明市", "泉州市", "漳州市", "南平市", "龙岩市", "宁德市"],
        "湖南省": ["全省", "长沙市", "株洲市", "湘潭市", "衡阳市", "邵阳市", "岳阳市", "常德市", "张家界市", "益阳市", "郴州市", "永州市", "怀化市", "娄底市", "湘西土家族苗族自治州"],
        "辽宁省": ["全省", "沈阳市", "大连市", "鞍山市", "抚顺市", "本溪市", "丹东市", "锦州市", "营口市", "阜新市", "辽阳市", "盘锦市", "铁岭市", "朝阳市", "葫芦岛市"],
        "山东省": ["全省", "济南市", "青岛市", "淄博市", "枣庄市", "东营市", "烟台市", "潍坊市", "济宁市", "泰安市", "威海市", "日照市", "莱芜市", "临沂市", "德州市", "聊城市", "滨州市", "菏泽市"],
        "湖北省": ["全省", "武汉市", "黄石市", "十堰市", "荆州市", "宜昌市", "襄樊市", "鄂州市", "荆门市", "孝感市", "黄冈市", "咸宁市", "随州市", "仙桃市", "天门市", "潜江市", "神农架林区", "恩施土家族苗族自治州"],
        "黑龙江省": ["全省", "哈尔滨市", "齐齐哈尔市", "鹤 岗 市", "双鸭山市", "鸡 西 市", "大 庆 市", "伊 春 市", "牡丹江市", "佳木斯市", "七台河市", "黑 河 市", "绥 化 市", "大兴安岭地区"],
        "海南省": ["全省", "海口市", "三亚市", "五指山市", "琼海市", "儋州市", "文昌市", "万宁市", "东方市", "澄迈县", "定安县", "屯昌县", "临高县", "白沙黎族自治县", "昌江黎族自治县", "乐东黎族自治县", "陵水黎族自治县", "保亭黎族苗族自治县", "琼中黎族苗族自治县"],
        "山西省": ["全省", "太原市", "大同市", "阳泉市", "长治市", "晋城市", "朔州市", "晋中市", "运城市", "忻州市", "临汾市", "吕梁市"],
        "甘肃省": ["全省", "兰州市", "金昌市", "白银市", "天水市", "嘉峪关市", "武威市", "张掖市", "平凉市", "酒泉市", "庆阳市", "定西市", "陇南市", "临夏回族自治州", "甘南藏族自治州"],
        "贵州省": ["全省", "贵阳市", "六盘水市", "遵义市", "安顺市", "铜仁地区", "毕节地区", "黔西南布依族苗族自治州", "黔东南苗族侗族自治州", "黔南布依族苗族自治州"],
        "宁夏回族自治区": ["全区", "银川市", "石嘴山市", "吴忠市", "固原市", "中卫市"],
        "广西壮族自治区": ["全区", "南宁市", "柳州市", "桂林市", "梧州市", "北海市", "防城港市", "钦州市", "贵港市", "玉林市", "百色市", "贺州市", "河池市", "来宾市", "崇左市"],
        "云南省": ["全省", "昆明市", "曲靖市", "玉溪市", "保山市", "昭通市", "丽江市", "思茅市", "临沧市", "文山壮族苗族自治州", "红河哈尼族彝族自治州", "西双版纳傣族自治州", "楚雄彝族自治州", "大理白族自治州", "德宏傣族景颇族自治州", "怒江傈傈族自治州", "迪庆藏族自治州"],
        "青海省": ["全省", "西宁市", "海东地区", "海北藏族自治州", "黄南藏族自治州", "海南藏族自治州", "果洛藏族自治州", "玉树藏族自治州", "海西蒙古族藏族自治州"],
        "新疆维吾尔自治区": ["全区", "乌鲁木齐市", "克拉玛依市", "石河子市", "阿拉尔市", "图木舒克市", "五家渠市", "吐鲁番市", "阿克苏市", "喀什市", "哈密市", "和田市", "阿图什市", "库尔勒市", "昌吉市　", "阜康市", "米泉市", "博乐市", "伊宁市", "奎屯市", "塔城市", "乌苏市", "阿勒泰市"],
        "内蒙古自治区": ["全区", "呼和浩特市", "包头市", "乌海市", "赤峰市", "通辽市", "鄂尔多斯市", "呼伦贝尔市", "巴彦淖尔市", "乌兰察布市", "锡林郭勒盟", "兴安盟", "阿拉善盟"],
        "西藏自治区": ["全区", "拉萨市", "那曲地区", "昌都地区", "山南地区", "日喀则地区", "阿里地区", "林芝地区"],
        "台湾省": ["全省", "台北市", "高雄市", "基隆市", "台中市", "台南市", "新竹市", "嘉义市", "台北县", "宜兰县", "桃园县", "新竹县", "苗栗县", "台中县", "彰化县", "南投县", "云林县", "嘉义县", "台南县", "高雄县", "屏东县", "澎湖县", "台东县", "花莲县"],
        "澳门特别行政区": ["澳门特别行政区"],
        "香港特别行政区": ["香港特别行政区"]
    };
    var provinces = [];
    for (var key in map) {
        provinces.push(key);
    }

    jQuery.fn.pcmap = function (config) {

        var _this = $(this);
        var conf = config || {};
        var defaultProvince = conf.province || _this.attr('data-province') || "";
        var defaultCity = conf.city || _this.attr('data-city') || "";
        var first = true;
        this.getValue = function () {
            var result = {};
            var province = _this.find(".pcmap-province-select").val();
            var city = _this.find(".pcmap-city-select").val();
            result.province = province;
            result.city = city;
            return result;
        }

        var onprovincechange = function () {
            var selectedProvince = _this.find(".pcmap-province-select").val();
            var citySelect = _this.find(".pcmap-city-select");
            if (citySelect.size() > 0) {
                citySelect.remove();
            }

            var cities = map[selectedProvince];
            var select = $("<select class='pcmap-city-select'></select>");
            var clen = cities.length;
            for (var i = 0; i < clen; i++) {
                var option = $('<option value="' + cities[i] + '">' + cities[i] + '</option>');
                if (defaultCity != '' && cities[i].indexOf(defaultCity) > -1) {
                    if (first) {
                        option.attr('selected', 'selected');
                    }
                }
                select.append(option);
            }
            _this.append(select);
            first = false;
        }

        var select = $("<select class='pcmap-province-select'></select>");

        var len = provinces.length;
        for (var i = 0; i < len; i++) {
            var option = $('<option value="' + provinces[i] + '">' + provinces[i] + '</option>');
            if (defaultProvince != '' && provinces[i].indexOf(defaultProvince) > -1) {
                option.attr('selected', "selected");
            }
            select.append(option);
        }
        select.change(onprovincechange);
        _this.html(select);

        onprovincechange();

        return this;
    }

})($);

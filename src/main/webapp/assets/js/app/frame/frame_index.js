;
(function($,document,window,undefine){
    /**
     * top-left下拉菜单
     */
    $(".topmenu-div").hover(function(){
        var self = $(this);
        var topmenuBtn = self.find(".topmenu-btn");

        self.find('.topmenu').show();
        $(topmenuBtn).css({
            "margin-top": "7px",
            "transform":"rotate(45deg)",
            "-ms-transform":"rotate(45deg)",
            "-moz-transform":"rotate(45deg)",
            "-webkit-transform":"rotate(45deg)",
            "-o-transform":"rotate(45deg)",
        });
    },function(){
        var self = $(this);
        self.find('.topmenu-btn').css({
            "margin-top": "0",
            "transform":"rotate(225deg)",
            "-ms-transform":"rotate(225deg)",
            "-moz-transform":"rotate(225deg)",
            "-webkit-transform":"rotate(225deg)",
            "-o-transform":"rotate(225deg)",
        });
        self.find('.topmenu').hide();
    });
})(jQuery,document,window);



function goToTab(obj) {
    window.location.href = obj.href;
}
$(document).ready(function () {


    $(".right-menu-dropdown").hover(function(){
        $(this).find(".yp-menu-dropdown-list").addClass("open");
    }, function(){
        $(this).find(".yp-menu-dropdown-list").removeClass("open");
    });
})

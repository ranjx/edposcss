

$(document).ready(function () {
    $('.hasSub').click(function () {
        var _this = $(this);
        var subShow = _this.hasClass('active');
        if(subShow){
            _this.find('.toggle-icon').removeClass('active');
            _this.removeClass('active');
            _this.parent().find('.sub-nav').removeClass('active');
        }else{
            _this.find('.toggle-icon').addClass('active');
            _this.addClass('active');
            _this.parent().find('.sub-nav').addClass('active');
        }
    });

    //var currentPath=window.location.pathname;
    var currentPath='/frame/systemSetting';
    $('#leftNav a').each(function(){
        var hrefUrl = $(this).attr('href');
        if(currentPath == hrefUrl){
            var isLiParent = $(this).parent().is('li');
            if(isLiParent === true){
                $(this).parent().addClass('active');
                $(this).parents('.cos').find('.toggle-icon,.hasSub,.sub-nav').addClass('active');
            }else{
                $(this).addClass('active');
            }

        }
    });


});
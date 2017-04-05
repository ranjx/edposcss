<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<script type="text/javascript" src="/assets/js/common/jquery-1.11.3.min.js"></script>
<script type="text/javascript" src="/assets/js/h5js/polyfill.min.js"></script>
<!--[if lt IE 9]>
<script src="/assets/js/common/html5shiv.min.js"></script>
<script src="/assets/js/common/respond.min.js"></script>
<![endif]-->
<script type="text/javascript" src="/assets/js/common/bootstrap-3.2.0.min.js"></script>
<script src="/assets/js/app/frame/frame_index.js?t=5"></script>
<script src="/assets/js/app/frame/common.js?t=10"></script>
<script type="text/javascript" src="/assets/js/common/center-dialog.js?t=20140228"></script>

<script type="text/javascript" src="/assets/js/common/jquery-wk-common.js"></script>
<script type="text/javascript" src="/assets/js/common/jquery-plug.js"></script>
<script type="text/javascript" src="/assets/js/common/jquery.validate.min.js"></script>

<script type="text/javascript" src="/assets/plugin/layerui/layui.js"></script>
<script type="text/javascript" src="/assets/js/plugins/bootstrap-table/bootstrap-table.min.js"></script>
<script type="text/javascript" src="/assets/js/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>
<script type="text/javascript" src="/assets/js/common/ajaxfileupload.js"></script>
<script type="text/javascript" src="/assets/js/app/validator.js"></script>
<script type="text/javascript" src="/assets/js/app/common.js"></script>
<script type="text/javascript" src="/assets/plugin/sweetalert/sweetalert.min.js"></script>

<script type="text/javascript" src="/assets/plugin/ztree/jquery.ztree.core.js"></script>
<script type="text/javascript" src="/assets/plugin/ZeroClipboard/jquery.zeroclipboard.min.js"></script>
<script type="text/javascript" src="/assets/js/common/usider.js"></script>
<script>
    !function () {
        function a() {
            //bootstarptable resetsize
            if($('.table.table-hover').length > 0){
                $('.table.table-hover').each(function (index,dom) {
                    var id =$(dom).attr('id');
                    if(id !==undefined){
                        $('#'+id).bootstrapTable('resetView');
                    }
                })
            }
        }
        var b = null;
        window.addEventListener("resize", function () {
            clearTimeout(b);
            b = setTimeout(a, 300)
        }, !1);
        a();
    }(window);

    jQuery(document).ready(function() {
        $('#status').fadeOut();
        $('#preloader').delay(350).fadeOut('slow');
        $('body').delay(350).css({'overflow':'visible'});
    });
</script>
<!-- loading -->
<div id="preloader">
    <div id="status">&nbsp;</div>
</div>
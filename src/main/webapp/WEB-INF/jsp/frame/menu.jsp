<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<title>客服左侧菜单</title>
<body>
<div class="sider-bar-bk">
    <ul class="sider-nav">
        <li class="sider-nav-item">
            <h3><a><span>销售管理</span></a></h3>
            <ul class="sider-nav-s">
                <li onclick="openMenuSrc('/order/orderManagement')"><a>订单管理</a></li>
                <li onclick="openMenuSrc('/angent/angentUserManagement')"><a>代理商管理</a></li>
            </ul>
        </li>
        <li class="sider-nav-item">
            <h3><a><span>用户管理</span></a></h3>
            <ul class="sider-nav-s">
                <li onclick="openMenuSrc('/acc/userInfo')"><a>用户信息</a></li>
                <li onclick="openMenuSrc('/acc/userModPwd')"><a>修改密码</a></li>
            </ul>
        </li>
    </ul>
</div>
</body>
<jsp:include page="../frame/js.jsp"></jsp:include>
<script type="text/javascript">
    $(function() {
        if($('.site-nav').size() > 0){
            $('.sider-bar').height($('.main-wrap').height());
        }
        $(document).on('click', '.sider-nav-item', function(){
            if(!$(this).hasClass('current')){
                $('.sider-nav-item').removeClass('current');
                $(this).addClass('current');
            }
        });
        $(document).on('click', '.sider-nav-s li', function(){
            if(!$(this).hasClass('current')){
                $('.sider-nav-s li').removeClass('current');
                $(this).addClass('current');
            }
        });
    });

    function openMenuSrc(src) {
        $("#indexTab").attr("src",src);
    }
</script>
</html>
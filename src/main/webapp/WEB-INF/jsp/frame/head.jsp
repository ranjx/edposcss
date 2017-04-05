<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.edpos.common.constant.GlobalConstant" %>
<body>
<div id="hd">
    <div class="header-nav">
        <div class="navigation-inner">
            <div class="logo">
                <h1>
                    <a href="#" class="logo-img"><%=GlobalConstant.PLATFORM_NAME%></a>
                </h1>
            </div>
            <div class="login-user">
                <i class="iconfont icon-gerenxinxi-copy"></i>
                <a class="javascript:;">您好！${SEESION_USER.user.userName}-客服管理员</a>

                <div class="user-opt-panel">
                    <ul class="user-opt">
                        <li class="div-line">
                            <a href="javascript:doLogout();">
                                <i class="iconfont icon-tuichu-copy"></i>
                                <span class="pf-opt-name">退出</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
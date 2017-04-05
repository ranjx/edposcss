package com.edpos.ccs.security;

import com.edpos.common.constant.GlobalConstant;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.authz.UnauthorizedException;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.util.SimpleByteSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.MessageSourceAware;
import org.springframework.context.support.MessageSourceAccessor;

import com.edpos.account.entity.EdposUser;
import com.edpos.account.service.IEdposPartyService;

/**
 * Created by ranjx on 16/9/30.
 */
public class  SecurityRealm extends AuthorizingRealm implements MessageSourceAware {
    protected static final Logger logger = LoggerFactory.getLogger(SecurityRealm.class);

    private MessageSourceAccessor messages;

    @Autowired
    private IEdposPartyService edposPartyService;

    //当调用subject.hasRole()、checkPermission等方法时会回调该方法，该方法在AuthorizingRealm.getAuthorizationInfo方法中
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
        return info;
    }

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken)
            throws AuthenticationException {

        String account, password;
        Object principal = authenticationToken.getPrincipal();
        Object credentials = authenticationToken.getCredentials();
        if (principal != null && principal instanceof String) {
            account = (String) principal;
        } else {
            throw new UnknownAccountException("手机号码未输入");
        }
        if (credentials != null && credentials instanceof char[]) {
            password = String.valueOf((char[]) credentials);
        } else {
            throw new IncorrectCredentialsException("密码未输入");
        }

        SimpleAuthenticationInfo authenticationInfo = null;
        EdposUser user = null;
        try {
            user = edposPartyService.getUserByAccount(account);
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (user == null) {
            throw new UnknownAccountException();// 没找到帐号
        }
        if(user.getUserType().equals(GlobalConstant.EDPOS_USER_USER_TYPE_USER)){
            throw new LockedAccountException();
        }
        SimpleByteSource slat = new SimpleByteSource("");
        authenticationInfo = new SimpleAuthenticationInfo(user.getAccount(), // 用户名
                user.getPassword(), // 密码
                slat, getName() // realm name
        );

        return authenticationInfo;
    }


    public void setMessageSource(MessageSource messageSource) {
        this.messages = new MessageSourceAccessor(messageSource);
    }

    /**
     * 将一些数据放到ShiroSession中,以便于其它地方使用
     * @see  比如Controller,使用时直接用HttpSession.getAttribute(key)就可以取到
     */
    private void setSession(Object key, Object value){
        Subject currentUser = SecurityUtils.getSubject();
        if(null != currentUser){
            Session session = currentUser.getSession();
            //System.out.println("Session默认超时时间为[" + session.getTimeout() + "]毫秒");
            if(null != session){
                session.setAttribute(key, value);
            }
        }
    }
}


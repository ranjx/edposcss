package com.edpos.ccs.security;

import com.edpos.common.util.Md5Util;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.credential.SimpleCredentialsMatcher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by ranjx on 2016/11/13.
 */
public class EdposCredentialsMatcher extends SimpleCredentialsMatcher {

    private static final Logger log = LoggerFactory.getLogger(EdposCredentialsMatcher.class);



    public boolean doCredentialsMatch(AuthenticationToken token, AuthenticationInfo info) {

        String account = (String)token.getPrincipal();
        String password =   String.valueOf((char[]) token.getCredentials());//未hash过2次

        String accountFDB = (String)info.getPrincipals().getPrimaryPrincipal();

        String passwordFDB = (String)info.getCredentials();
        log.info(account + "_"+ password);
        log.info(accountFDB + "_"+ passwordFDB);
        password = Md5Util.Md5Encode(password,null);
        password = Md5Util.Md5Encode(password,null);
        if(StringUtils.equals(account,accountFDB) && StringUtils.equals(password,passwordFDB))
          return true;
        else
            return false;

    }
}

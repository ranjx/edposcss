package com.edpos.ccs.util;

import com.edpos.account.vo.EdposSessionUser;
import com.edpos.common.constant.GlobalConstant;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * Created by wangluyin on 16/10/6.
 */
public class SessionUtils {
    public static EdposSessionUser getSessionUser(HttpServletRequest request){
        EdposSessionUser sessionUser = null;
        HttpSession session = request.getSession(true);
        Object obj = session.getAttribute(GlobalConstant.SESSION_USER_KEY);
        if(obj!=null)
             sessionUser = (EdposSessionUser)obj;
        return sessionUser;
    }

    public static void setSessionUser(HttpServletRequest request,EdposSessionUser sessionUser){
        request.getSession(true).setAttribute(GlobalConstant.SESSION_USER_KEY, sessionUser);
    }


    public static long getPartyId(HttpServletRequest request){
        long partyId = 0;
        EdposSessionUser sessionUser = getSessionUser(request);
        if(sessionUser!=null){
             partyId = sessionUser.getParty().getPartyId();
        }
        return partyId;
    }

    public static String getSessionCaptcha( HttpServletRequest request){
        HttpSession session = request.getSession(true);
        Object obj = session.getAttribute(GlobalConstant.SESSION_KEY_CAPTCHA);
        if(obj!=null){
            return (String)obj;
        }
        return null;
    }

    public static void setSessionCaptcha(HttpServletRequest request,String captcha){
        request.getSession(true).setAttribute(GlobalConstant.SESSION_KEY_CAPTCHA, captcha);
    }
}

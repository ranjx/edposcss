package com.edpos.ccs.controller;

import com.edpos.account.entity.*;
import com.edpos.account.service.IEdposPartyService;
import com.edpos.account.service.IEdposSmsService;
import com.edpos.account.util.SessionUtils;
import com.edpos.account.vo.EdposSessionUser;
import com.edpos.common.constant.GlobalConstant;
import com.edpos.common.util.IpUtil;
import com.edpos.common.util.Md5Util;
import com.edpos.common.util.VerifyCodeUtils;
import com.edpos.common.vo.Json;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.UnauthorizedException;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Created by ranjx on 16/9/29.
 */
@Controller
public class RegisterController {
    private ExecutorService tp = Executors.newCachedThreadPool();
    @Autowired
    private IEdposPartyService edposPartyService;
    @Autowired
    private IEdposSmsService edposSmsService;

    @Autowired
    HttpServletRequest request;
    @Autowired
    HttpServletResponse response;

    /**
     * 首页
     * @return
     */
    @RequestMapping("/index")
    public String index() {
        return "/index";
    }

    /**
     * 登录页面
     * @return
     */
    @RequestMapping("/login")
    public String login() {
        return "/component/login";
    }

    /**
     * 找回密码
     * @return
     */
    @RequestMapping("/findpassword")
    public String findpassword() {
        return "/component/findpassword";
    }

    /**
     * 验证码
     * @throws IOException
     */
    @RequestMapping("/captcha")
    @ResponseBody
    public void captcha() throws IOException {
        response.setHeader("Pragma", "No-cache");
        response.setHeader("Cache-Control", "no-cache");
        response.setDateHeader("Expires", 0);
        response.setContentType("image/jpeg");
        //生成随机字串
        String verifyCode = VerifyCodeUtils.generateVerifyCode(4);
        //存入会话session
        SessionUtils.setSessionCaptcha(request, verifyCode);
        //生成图片
        int w = 120, h = 32;
        VerifyCodeUtils.outputImage(w, h, response.getOutputStream(), verifyCode);
    }


    @RequestMapping("/checkCaptchaCode")
    @ResponseBody
    public Json checkCaptchaCode(String code) {
        Json json = new Json();
        try {
            String verifyCode = SessionUtils.getSessionCaptcha(request);
            if (StringUtils.equalsIgnoreCase(verifyCode, code)) {
                json.setSuccess(true);
            }
        } catch (Exception e) {
            json.setMsg(e.getMessage());
        }
        return json;
    }

    @RequestMapping("/sendSmsCode")
    @ResponseBody
    public Json sendSmsCode(String mobile) throws IOException {
        Json json = new Json();
        try {
            json = edposSmsService.sendRegisterSmsCode(mobile);
         } catch (Exception e) {
            json.setMsg(e.getMessage());
        }
        return json;
    }


    private boolean checkRegisterVerifySmsCode(String mobile, String smsCode) {
        String codeType = GlobalConstant.SMS_TEMPLATE_REGISTER;
        String verifyCode = edposSmsService.getVerifyCode(mobile, codeType);
        if (verifyCode != null && StringUtils.equals(verifyCode, smsCode)) {
            return true;
        } else {
            return false;
        }
    }


    @RequestMapping("/checkSmsCode")
    @ResponseBody
    public Json checkSmsCode(String mobile, String smsCode) {
        Json json = new Json();
        try {
            json.setSuccess(checkRegisterVerifySmsCode(mobile, smsCode));
        } catch (Exception e) {
            json.setMsg(e.getMessage());
        }
        return json;
    }

    /**
     * 重置密码
     * @param user
     * @return
     */
    @RequestMapping("/resetPasswd")
    @ResponseBody
    public Json resetPasswd(EdposUser user, String code){
        Json json = new Json();
        try{
            boolean isPass = checkRegisterVerifySmsCode(user.getAccount(), code);
            if(isPass) {
                String password = user.getPassword();
                if(StringUtils.isEmpty(password)){
                    json.setMsg("密码不能为空");
                }else{
                    EdposUser userFDB = edposPartyService.getUserByAccount(user.getAccount());
                    userFDB.setPassword(user.getPassword());
                    encryptEdposUser(userFDB);
                    edposPartyService.chgUserPassword(userFDB.getPartyId(),userFDB.getUid(),userFDB.getPassword(),userFDB.getSalt());
                    json.setObj(user);
                    json.setSuccess(true);
                    json.setMsg("密码重置成功");
                }
            }else{
                json.setMsg("验证码输入错误");
            }
        }catch (Exception e){
            e.printStackTrace();
            json.setMsg(e.getMessage());
        }
        return json;
    }

    /**
     * 自助注销
     * @param user
     * @return
     */
    @RequestMapping("/cancelUser")
    @ResponseBody
    public Json cancelUser(EdposUser user, String code){
        Json json = new Json();
        try{
            boolean isPass = checkRegisterVerifySmsCode(user.getAccount(), code);
            if(isPass) {
                EdposUser userFDB = edposPartyService.getUserByAccount(user.getAccount());
                edposPartyService.deleteEdopsUser(userFDB.getPartyId(),new String[]{String.valueOf(userFDB.getUid())});
                json.setSuccess(true);
                json.setMsg("账号注销成功");
            }else{
                json.setMsg("验证码输入错误");
            }
        }catch (Exception e){
            e.printStackTrace();
            json.setMsg(e.getMessage());
        }
        return json;
    }

    /**
     * 对EdposUser进行密码加密处理
     * @param user
     */
    protected void encryptEdposUser(EdposUser user) {
        String mim = Md5Util.Md5Encode(user.getPassword(), null);
        mim = Md5Util.Md5Encode(mim, null);
        user.setPassword(mim);
    }


    @RequestMapping("/main")
    public String main() throws IOException {
        return "main";
    }

    @RequestMapping("/doLogin")
    @ResponseBody
    public Json doLogin(String account, String password, String code, String domain, Model model) throws IOException {
        Json json = new Json();
        String msg = "";
        try {
            String verifyCode = SessionUtils.getSessionCaptcha(request);
            if (StringUtils.equalsIgnoreCase(verifyCode, code)) {
                String ip = IpUtil.getIpAddr(request);
                UsernamePasswordToken token = new UsernamePasswordToken(account, password,true,ip);
                Subject subject = SecurityUtils.getSubject();
                subject.login(token);
                if (subject.isAuthenticated()) {
                    EdposSessionUser sessionUser = edposPartyService.getSessionUser(account);
                    EdposUser edposUserFDB = sessionUser.getUser();
                    SessionUtils.setSessionUser(request,sessionUser);
                    if(domain.equals(GlobalConstant.USER_ROLE_TALK)){
                        json.setSuccess(true);
                    }
                    if(domain.equals(GlobalConstant.USER_ROLE_CCS)){
                        if(edposUserFDB.getPositionId() !=null && edposUserFDB.getPositionId() == GlobalConstant.USER_POSITION_10001){
                            json.setSuccess(true);
                        }else{
                            msg = "您没有得到相应的授权[客服权限]";
                            model.addAttribute("message", msg);
                        }
                    }
                    if(domain.equals(GlobalConstant.USER_ROLE_ANGENT)){
                        if(edposUserFDB.getPositionId() !=null && edposUserFDB.getPositionId() == GlobalConstant.USER_POSITION_10002){
                            AngentUserInfo angentUserInfoFDB = edposPartyService.queryAngentUserInfoByUid(edposUserFDB.getUid());
                            if(angentUserInfoFDB.getAngentState().longValue() == GlobalConstant.ANGENT_STATE_0){
                                msg = "您目前已申请加入代理商，待客服审核，请登陆即聊手机端联系客服。";
                                model.addAttribute("message", msg);
                            }
                            json.setSuccess(true);
                        }else{
                            msg = "您当前还不是企业代理商，请到首页商务合作申请代理商，客服将在一个工作日内处理您的申请。";
                            model.addAttribute("message", msg);
                        }
                    }
                }
            } else {
                msg = "验证码输入错误";
                model.addAttribute("message", msg);
            }
        } catch (IncorrectCredentialsException e) {
            msg = "登录密码错误";
            model.addAttribute("message", msg);
        } catch (ExcessiveAttemptsException e) {
            msg = "登录失败次数过多";
            model.addAttribute("message", msg);
        } catch (LockedAccountException e) {
            //msg = "帐号已被锁定";
            msg = "您没有得到相应的授权";
            model.addAttribute("message", msg);
        } catch (DisabledAccountException e) {
            msg = "帐号已被禁用";
            model.addAttribute("message", msg);
        } catch (ExpiredCredentialsException e) {
            msg = "帐号已过期";
            model.addAttribute("message", msg);
        } catch (UnknownAccountException e) {
            msg = "账号不存在";
            model.addAttribute("message", msg);
        } catch (UnauthorizedException e) {
            msg = "您没有得到相应的授权";
            model.addAttribute("message", msg);
        } catch (Exception e) {
            msg= e.getMessage();
            model.addAttribute("message", msg);
        } finally {
            json.setMsg(msg);
            json.setObj(domain);
            return json;
        }
    }

    @RequestMapping("/doLogout")
    @ResponseBody
    public Json doLogout() throws IOException {
        Json json = new Json();
        String msg = "";
        try {
            Subject subject = SecurityUtils.getSubject();
            if (subject.isAuthenticated()) {
                subject.logout(); // session 会销毁，在SessionListener监听session销毁，清理权限缓存
            }
            json.setSuccess(true);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            json.setMsg(msg);
            return json;
        }
    }

}

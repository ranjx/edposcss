package com.edpos.ccs.controller;

import com.edpos.account.entity.*;
import com.edpos.account.service.IEdposPartyService;
import com.edpos.account.service.IStaticDataService;
import com.edpos.account.vo.EdposCompanyVO;
import com.edpos.account.vo.EdposPersonVO;
import com.edpos.account.vo.EdposSessionUser;
import com.edpos.ccs.util.KkContactThread;
import com.edpos.common.cache.RedisHelper;
import com.edpos.common.constant.GlobalConstant;
import com.edpos.common.util.Md5Util;
import com.edpos.common.util.NumberUtils;
import com.edpos.common.vo.Grid;
import com.edpos.common.vo.Json;
import com.edpos.common.vo.PageFilter;
import com.edpos.order.service.IOrderService;
import com.edpos.product.ptt.entity.EdposChannel;
import com.edpos.product.ptt.entity.EdposChannelUser;
import com.edpos.product.ptt.service.IEdposChannelService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.net.URLDecoder;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static com.edpos.account.util.SessionUtils.getSessionUser;


/**
 * Created by wangluyin on 16/9/17.
 */
@Controller
@RequestMapping("/acc")
public class AccountController extends RegisterController{
    private ExecutorService tp = Executors.newCachedThreadPool();
    @Autowired
    private IEdposPartyService edposPartyService;
    @Autowired
    private IEdposChannelService edposChannelService;
    @Autowired
    private IOrderService orderService;
    @Autowired
    private IStaticDataService staticDataService;

    /**
     * 用户信息
     * @return
     */
    @RequestMapping("/userInfo")
    public String userInfo() {
        return "/component/account/userInfo";
    }

    /**
     * 修改用户密码
     * @return
     */
    @RequestMapping("/userModPwd")
    public String userModPwd() {
        return "/component/account/userModPwd";
    }

    /**
     * 通过uid获取子账号信息
     * @param account
     * @return
     */
    @RequestMapping("/getEdposUserByAccount")
    @ResponseBody
    public Json getEdposUserByAccount(String account){
        Json json = new Json();
        try{
            EdposUser user = edposPartyService.getUserByAccount(account);
            json.setObj(user);
            json.setSuccess(true);
        }catch (Exception e){
            e.printStackTrace();
            json.setMsg(e.getMessage());
        }
        return json;
    }

    /**
     * 修改用户密码
     * @param uid
     * @param password
     * @return
     */
    @RequestMapping("/chgUserPassword")
    @ResponseBody
    public Json chgUserPassword(long uid, String password){
        Json json = new Json();
        try{
            if(StringUtils.isBlank(password)) {
                password= GlobalConstant.DEFAULT_PASSWORD;
            }
            EdposUser user = edposPartyService.getEdposUserByUid(uid);
            if(user == null){
                json.setMsg("未找到该账号，编号["+uid+"]");
            }else {
                user.setPassword(password);
                encryptEdposUser(user);
                edposPartyService.ccsChgUserPass(uid,user.getPassword());
                json.setSuccess(true);
                json.setMsg("密码修改成功，现密码为"+password);
            }
        }catch (Exception e){
            e.printStackTrace();
            json.setMsg(e.getMessage());
        }
        return json;
    }

    /**
     * 通过session获取登陆用户partyId
     * @return
     */
    private long getPartyId(){
        EdposSessionUser sessionUser = getSessionUser(request);
        long partyId = sessionUser.getParty().getPartyId();
        return partyId;
    }

    /**
     * 通过redis获取用户名称
     * @param uid
     * @return
     */
    @RequestMapping("/getUserName")
    @ResponseBody
    public Json getUserNameByUid(long uid){
        Json json = new Json();
        json.setObj(RedisHelper.getUname(uid));
        json.setSuccess(true);
        return json;
    }

    /**
     * 通过redis获取组织名称
     * @param orgId
     * @return
     */
    @RequestMapping("/getOrgName")
    @ResponseBody
    public Json getOrgNameById(long orgId){
        Json json = new Json();
        json.setObj(RedisHelper.getEdposOrg(orgId));
        json.setSuccess(true);
        return json;
    }

    /**
     * 通过redis获取用户状态
     * @param uid
     * @return
     */
    @RequestMapping("/getUserStateByUid")
    @ResponseBody
    public Json getUserStateByUid(long uid){
        Json json = new Json();
        json.setObj(RedisHelper.getPartyUserOnline(getPartyId(),uid));
        json.setSuccess(true);
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

    /**
     * 根据partyId获取公司信息
     * @return
     */
    @RequestMapping("/getCompanyVOByPartyId")
    @ResponseBody
    public Json getCompanyVOByPartyId(){
        Json json = new Json();
        try{
            EdposCompanyVO vo= edposPartyService.getCompanyVOByPartyId(getPartyId());
            json.setObj(vo);
            json.setSuccess(true);
        }catch (Exception e){
            e.printStackTrace();
            json.setMsg(e.getMessage());
        }
        return json;
    }

    /**
     * 根据partyId获取私人组织信息
     * @return
     */
    @RequestMapping("/getPersonVOByPartyId")
    @ResponseBody
    public Json getPersonVOByPartyId(){
        Json json = new Json();
        try{
            EdposPersonVO vo= edposPartyService.getPersonVOByPartyId(getPartyId());
            json.setObj(vo);
            json.setSuccess(true);
        }catch (Exception e){
            e.printStackTrace();
            json.setMsg(e.getMessage());
        }
        return json;
    }

    /**
     * 获取用户交通工具
     * @param uid
     * @return
     */
    @RequestMapping("/getUserToos")
    @ResponseBody
    public Json getUserToos(long uid){
        Json json = new Json();
        try{
            EdposUser user = edposPartyService.getEdposUserByUid(uid);
            json.setObj(user.getExt1());
            json.setSuccess(true);
        }catch (Exception e){
            e.printStackTrace();
            json.setMsg(e.getMessage());
        }
        return json;
    }

    /**
     * 发送app下载地址
     * @param uids
     * @return
     */
    @RequestMapping("/sendSmsAppUrl")
    @ResponseBody
    public Json sendSmsAppUrl(@RequestParam(value = "uids[]") long[] uids){
        Json json = new Json();
        try {
            EdposUser user = getSessionUser(request).getUser();
            if(user!=null){
                String appUrl = staticDataService.getDownAppUrl("AppUrl", String.valueOf(user.getPartyId()));
                edposPartyService.sendSmsAppUrl(uids,appUrl);
                json.setSuccess(true);
            }
        } catch (Exception e) {
            e.printStackTrace();
            json.setMsg(e.getMessage());
        }
        return json;
    }


}

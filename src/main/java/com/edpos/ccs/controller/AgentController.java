package com.edpos.ccs.controller;

import com.edpos.account.entity.*;
import com.edpos.account.service.IEdposPartyService;
import com.edpos.account.vo.EdposCompanyVO;
import com.edpos.common.constant.GlobalConstant;
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
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


/**
 * Created by ranjx on 16/9/17.
 */
@Controller
@RequestMapping("/angent")
public class AgentController extends RegisterController{
    private ExecutorService tp = Executors.newCachedThreadPool();
    @Autowired
    private IEdposPartyService edposPartyService;
    @Autowired
    private IEdposChannelService edposChannelService;
    @Autowired
    private IOrderService orderService;

    /**
     * 添加代理商
     * @param party
     * @param company
     * @param user
     * @return
     */
    @RequestMapping("/registerAngent")
    @ResponseBody
    public Json registerAngent(EdposParty party, EdposPartyCompany company, EdposUser user){
        Json json = new Json();
        try{
            String password = user.getPassword();
            if(StringUtils.isEmpty(password)){
                json.setMsg("密码为空");
            }else {
                encryptEdposUser(user);
                EdposCompanyVO vo = edposPartyService.registerAngentPartyCompany(party, company, user);
                if(vo != null){
                    //创建免费订单实例对讲视频10人1个月
                    orderService.freeOrder(vo.getParty().getPartyId(),10,1);
                    //生成默认频道
                    EdposChannel defaultChannel = new EdposChannel();
                    defaultChannel.setPartyId(vo.getParty().getPartyId());
                    defaultChannel.setChannelName(company.getCompanyName());
                    defaultChannel.setChannelType(GlobalConstant.CHANNEL_TYPE_99);
                    defaultChannel.setIsPublic(1l);
                    defaultChannel.setMaxCount(500l);
                    defaultChannel.setAdminUid(vo.getUser().getUid());
                    //0 表示默认频道
                    defaultChannel.setExt1("1");
                    EdposChannel channel = edposChannelService.saveOrUpdateChannel(defaultChannel);
                    //给默认频道添加注册用户
                    EdposChannelUser channelUser = new EdposChannelUser();
                    channelUser.setUid(vo.getUser().getUid());
                    channelUser.setChannelId(channel.getChannelId());
                    channelUser.setChnlUserType(GlobalConstant.CHANNEL_USER_TYPE_10);
                    channelUser.setChnlUserName(user.getUserName());
                    edposChannelService.saveChannelUser(channelUser, channel.getChannelId());
                    json.setObj(vo);
                    json.setMsg("注册成功");
                    json.setSuccess(true);
                }
            }
        }catch (Exception e){
            e.printStackTrace();
            json.setMsg(e.getMessage());
        }
        return json;
    }

    /**
     * 代理商管理
     * @return
     */
    @RequestMapping("/angentUserManagement")
    public String angentUserManagement(){
        return "/component/angent/angentUserManagement";
    }

    /**
     * 查询代理商信息
     * @param queryBean
     * @param pf
     * @return
     */
    @RequestMapping("/queryAngentInfo")
    @ResponseBody
    public Grid queryAngentInfo(AngentUserInfo queryBean, PageFilter pf){
        Grid grid = new Grid();
        try{
            List<AngentUserInfo> angentUserInfos = edposPartyService.queryAngentUserInfos(queryBean,pf);
            long count = edposPartyService.countAngentUserInfo(queryBean);
            grid.setRows(angentUserInfos);
            grid.setTotal(count);
        }catch (Exception e){
            e.printStackTrace();
            grid.setErrorMsg(e.getMessage());
        }
        return grid;
    }

    /**
     * 审核代理商
     * @param angentId
     * @return
     */
    @ResponseBody
    @RequestMapping("/affirmPassAngent")
    public Json affirmPassAngent(long angentId){
        Json json = new Json();
        try{
            edposPartyService.affirmPassAngent(angentId, GlobalConstant.ANGENT_STATE_1);
            json.setSuccess(true);
        }catch (Exception e){
            json.setMsg(e.getMessage());
        }
        return json;
    }
}

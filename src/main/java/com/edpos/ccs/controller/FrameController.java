package com.edpos.ccs.controller;

import com.edpos.account.service.IEdposPartyService;
import com.edpos.account.vo.EdposSessionUser;
import com.edpos.common.vo.Menu;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

import static com.edpos.account.util.SessionUtils.getSessionUser;

/**
 * Created by ranjx on 17/03/31.
 */
@Controller
@RequestMapping("/frame")
public class FrameController {

    @Autowired
    private IEdposPartyService edposPartyService;


    @Autowired
    HttpServletRequest request;
    @Autowired
    HttpServletResponse response;



    @RequestMapping("/main")
    public String main() {
        return "/frame/main";
    }


    @RequestMapping("/css")
    public String css() {
        return "/frame/css";
    }

    @RequestMapping("/js")
    public String js() {
        return "/frame/js";
    }


    @RequestMapping("/head")
    public String head() {
        return "/frame/head";
    }




    @RequestMapping("/menu")
    public ModelAndView menu() {
        ModelAndView modelAndView = new ModelAndView("/frame/menu");
        List<Menu> menus = new ArrayList<Menu>();
        Menu menu1 = new Menu(1L,"管理控制台","/frame/main",null);
        menus.add(menu1);
        Menu menu2 = new Menu(2L,"设置",null,null);
        menus.add(menu2);
        Menu menu21 = new Menu(21L,"系统设置","/frame/systemSetting",null);
        Menu menu22 = new Menu(22L,"账户设置","/frame/accountSetting",null);
        Menu menu23 = new Menu(23L,"密码设置","/frame/passwordSetting",null);
        menu2.addMenu(menu21);
        menu2.addMenu(menu22);
        menu2.addMenu(menu23);
        modelAndView.addObject("menus",menus);
        return modelAndView;
    }

    @RequestMapping("/work")
    public String work(){
        EdposSessionUser sessionUser = getSessionUser(request);
        long partyId = sessionUser.getParty().getPartyId();
        boolean checkLogin = edposPartyService.getUserByPartyId(partyId);
        if(checkLogin){
            return "/component/userNav";
        }else{
            return "/component/workMain";
        }
    }

    /**
     * G-TALKING后台
     * @return
     */
    @RequestMapping("/workMain")
    public String workMain(){
        EdposSessionUser sessionUser = getSessionUser(request);
        long partyId = sessionUser.getParty().getPartyId();
        boolean checkLogin = edposPartyService.getUserByPartyId(partyId);
        if(checkLogin){
            return "/component/userNav";
        }else{
            return "/component/workMain";
        }
    }

    /**
     * 客服后台
     * @return
     */
    @RequestMapping("/ccsMain")
    public String ccsMain(){
        return "/component/ccsMain";
    }

    /**
     * 代理商后台
     * @return
     */
    @RequestMapping("/angentMain")
    public String angentMain(){
        return "/component/angentMain";
    }
}

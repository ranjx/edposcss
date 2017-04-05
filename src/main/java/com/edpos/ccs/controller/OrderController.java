package com.edpos.ccs.controller;

import com.alibaba.fastjson.JSON;
import com.edpos.common.vo.Grid;
import com.edpos.common.vo.Json;
import com.edpos.common.vo.PageFilter;
import com.edpos.order.entity.InstanceProduct;
import com.edpos.order.entity.SoPayInfo;
import com.edpos.order.entity.SoProdAttr;
import com.edpos.order.entity.SoRecord;
import com.edpos.order.service.IOrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * Created by ranjx on 17/01/10.
 */
@Controller
@RequestMapping("/order")
public class OrderController {

    protected static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    @Autowired
    HttpServletRequest request;
    @Autowired
    HttpServletResponse response;
    @Autowired
    private IOrderService orderService;

    /**
     * 订单管理
     * @return
     */
    @RequestMapping("/orderManagement")
    public String orderManagement() {
        return "/component/order/orderManagement";
    }

    /**
     * 查询订单
     * @param queryBean
     * @param pf
     * @return
     */
    @RequestMapping("/querySoRecords")
    @ResponseBody
    public Grid querySoRecords(SoRecord queryBean, PageFilter pf){
        Grid grid = new Grid();
        try{
            List<SoRecord> soRecords = orderService.querySoRecords(queryBean,pf);
            long count = orderService.countSoRecord(queryBean);
            grid.setRows(soRecords);
            grid.setTotal(count);
        }catch (Exception e){
            e.printStackTrace();
            grid.setErrorMsg(e.getMessage());
        }
        return grid;
    }

    /**
     * 订单详情
     * @return
     */
    @RequestMapping("/orderDetail")
    public ModelAndView orderPayDetail(long orderId) {
        Map<String, Object> data = new HashMap<>();
        try{
            SoRecord soRecord = orderService.querySoRecordById(orderId);
            SoPayInfo soPayInfo = orderService.querySoPayInfoByOrderId(orderId);
            data.put("soRecord", JSON.toJSONString(soRecord));
            data.put("soPayInfo", JSON.toJSONString(soPayInfo));
        }catch (Exception e){
            logger.error(e.getMessage());
        }
        return new ModelAndView("/component/order/orderDetail",data);
    }

    /**
     * 订单实例详情
     * @return
     */
    @RequestMapping("/orderInstanceDetail")
    public ModelAndView orderInstanceDetail(long orderId) {
        Map<String, Object> data = new HashMap<>();
        try{
            List<InstanceProduct> instanceProducts = orderService.queryInstanceProductByOrderId(orderId);
            List<SoProdAttr> soProdAttrs = orderService.querySoProdAttrByOrderId(orderId);
            SoPayInfo soPayInfo = orderService.querySoPayInfoByOrderId(orderId);
            data.put("insProds", JSON.toJSONString(instanceProducts));
            data.put("soProdAttrs", JSON.toJSONString(soProdAttrs));
            data.put("soPayInfo", JSON.toJSONString(soPayInfo));
        }catch (Exception e){
            logger.error(e.getMessage());
        }
        return new ModelAndView("/component/order/orderInstanceDetail",data);
    }

    /**
     * 确认订单
     * @param orderId
     * @return
     */
    @ResponseBody
    @RequestMapping("/affirmOrder")
    public Json affirmOrder(long orderId){
        Json json = new Json();
        try{
            orderService.affirmSoRecord(orderId);
            json.setSuccess(true);
        }catch (Exception e){
            json.setMsg(e.getMessage());
        }
        return json;
    }
}

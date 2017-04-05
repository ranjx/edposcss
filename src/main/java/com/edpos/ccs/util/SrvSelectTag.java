package com.edpos.ccs.util;

import org.apache.log4j.Logger;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.tagext.TagSupport;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;

public class SrvSelectTag extends TagSupport {

    private static Logger log = Logger.getLogger(SrvSelectTag.class);
    private static final long serialVersionUID = 1L;

    public String id;
    public String srvname;
    public String funcname;
    public String params;
    public String valuecol;
    public String desccol;
    public String shownull;

    public int doStartTag() {
        if (id == null) {
            id = funcname;
        }
        try {
            ApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(pageContext
                    .getServletContext());
            Object srvbean = ctx.getBean(srvname);

            Method method = srvbean.getClass().getMethod(funcname, new Class[] { HashMap.class });
            HashMap paramMap = new HashMap();
            if (params != null && !"".equals(params)) {
                String[] paramArray = params.split("&");
                if (paramArray != null && paramArray.length > 0) {
                    for (int t = 0; t < paramArray.length; t++) {
                        if (!"".equals(paramArray[t])) {
                            String[] paramDtl = paramArray[t].split("=");
                            if (paramDtl != null && paramDtl.length == 2) {
                                paramMap.put(paramDtl[0], paramDtl[1]);
                            }
                        }
                    }
                }
            }
            List resultList = (List) method.invoke(srvbean, new Object[] { paramMap });

            JspWriter out = pageContext.getOut();
            out.println("<select name='" + id + "' id='" + id + "' lay-verify='' lay-search>");
            if (shownull != null && "true".equalsIgnoreCase(shownull)) {
                out.println("<option value='0' >请选择</option>");
            }

            for (int i = 0; i < resultList.size(); i++) {
                Object object = resultList.get(i);
                String methodName = "get" + valuecol.substring(0, 1).toUpperCase() + valuecol.substring(1);
                Method m = object.getClass().getMethod(methodName);
                String value = m.invoke(object).toString();

                methodName = "get" + desccol.substring(0, 1).toUpperCase() + desccol.substring(1);
                m = object.getClass().getMethod(methodName);
                String desc = m.invoke(object).toString();
                out.println("<option value='" + value + "'>" + desc + "</option>");
            }

            out.println("</select>");
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
        return SKIP_BODY;
    }

    public int doEndTag() {
        return EVAL_PAGE;
    }

    public String getDesccol() {
        return desccol;
    }

    public void setDesccol(String desccol) {
        this.desccol = desccol;
    }

    public String getFuncname() {
        return funcname;
    }

    public void setFuncname(String funcname) {
        this.funcname = funcname;
    }

    public String getParams() {
        return params;
    }

    public void setParams(String params) {
        this.params = params;
    }

    public String getShownull() {
        return shownull;
    }

    public void setShownull(String shownull) {
        this.shownull = shownull;
    }

    public String getSrvname() {
        return srvname;
    }

    public void setSrvname(String srvname) {
        this.srvname = srvname;
    }

    public String getValuecol() {
        return valuecol;
    }

    public void setValuecol(String valuecol) {
        this.valuecol = valuecol;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}

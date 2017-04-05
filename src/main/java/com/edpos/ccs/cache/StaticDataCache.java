package com.edpos.ccs.cache;

import com.edpos.account.entity.SysStaticData;
import com.edpos.account.service.IStaticDataService;
import com.edpos.common.cache.LocalCacheCont;
import com.edpos.common.enums.CommonConst;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("sysStaticData")
public class StaticDataCache extends LocalCacheCont<SysStaticData> {

    private static String id = "SYS_STATIC_DATA";

    @Autowired
    private IStaticDataService staticDataService;

    public HashMap<String, List<SysStaticData>> loadData() throws Exception {

        Map<String, Object> params = new HashMap<String, Object>();
        params.put(SysStaticData.ALIAS_STATE, CommonConst.STATE_EFF);
        List<SysStaticData> res = staticDataService.queryStaticDatas();
        HashMap<String, List<SysStaticData>> objMap = new HashMap<>();
        for (SysStaticData staticData : res) {
            if (objMap.containsKey(staticData.getCodeKey())) {
                List<SysStaticData> list = objMap.get(staticData.getCodeKey());
                list.add(staticData);
            } else {
                List<SysStaticData> list = new ArrayList<>();
                list.add(staticData);
                objMap.put(staticData.getCodeKey(), list);
            }
        }
        return objMap;
    }

    @Override
    public String getCacheId() throws Exception {
        return id;
    }

    public static String cacheId() {
        return id;
    }

    /**
     * 根据key-value获取对象值
     * @param codeKey
     * @param codeValue
     * @return
     * @throws Exception
     */
    public SysStaticData getValue(String codeKey, String codeValue) throws Exception {
        if(codeKey == null || codeKey.length() < 1)
            return null;
        List<SysStaticData> list = getList(codeKey);
        if(list != null && list.size() > 0){
            for(SysStaticData data : list){
                if(data.getCodeKey().equals(codeValue)){
                    return data;
                }
            }
        }
        return null;
    }



}

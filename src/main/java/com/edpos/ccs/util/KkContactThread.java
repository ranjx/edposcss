package com.edpos.ccs.util;

import com.edpos.account.entity.EdposUser;
import com.edpos.account.entity.KkContact;
import com.edpos.account.service.IEdposPartyService;
import com.edpos.common.util.DateUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * Created by ranjx on 2016/12/8.
 */
public class KkContactThread implements Runnable{
    private static Logger logger = LoggerFactory.getLogger(KkContactThread.class);

    private IEdposPartyService edposPartyService;
    private Long partyId;

    public KkContactThread(IEdposPartyService edposPartyService, Long partyId) {
        this.edposPartyService = edposPartyService;
        this.partyId = partyId;
    }

    @Override
    public void run() {
        try {
            Thread.sleep(3000);
            try {
                //同步好友关系
                List<EdposUser> edposUsersASC = edposPartyService.getEdposUsersByPartyId(partyId, "uid", "asc");
                List<EdposUser> edposUsersDESC = edposPartyService.getEdposUsersByPartyId(partyId, "uid", "desc");
                for (EdposUser ascUser : edposUsersASC) {
                    for (EdposUser descUser : edposUsersDESC) {
                        KkContact contactAFDB  = edposPartyService.queryKkContactByUid(ascUser.getUid(),descUser.getUid());
                        if(contactAFDB == null){
                            this.saveContact(ascUser.getUid(),descUser.getUid());
                        }
                        KkContact contactBFDB  = edposPartyService.queryKkContactByUid(descUser.getUid(),ascUser.getUid());
                        if(contactBFDB == null){
                            this.saveContact(descUser.getUid(),ascUser.getUid());
                        }
                    }
                }
            } catch (Exception ee) {
                logger.error(ee.getMessage());
            }
        } catch (Exception e) {
            logger.error("发送消息失败>>>>>>" + e.getMessage(), e);
        }
    }

    private void saveContact(Long uidA, Long uidB){
        KkContact contactA = new KkContact();
        contactA.setUid(uidA);
        contactA.setContactId(uidB);
        contactA.setRelation(4);
        contactA.setRelation4me(4);
        contactA.setDealTime(DateUtil.getCalendarCurrentTimestamp());
        edposPartyService.saveKkContact(contactA);
        //刷新IM
        edposPartyService.refreshIm(String.valueOf(uidA));
    }

}

package com.ssafy.api.service;

import com.ssafy.api.request.AnnouncementRegisterReq;
import com.ssafy.api.response.AnnouncementRes;
import java.util.List;

public interface AnnouncementService {

    // 공지사항 생성 (관리자 계정 전용)
    AnnouncementRes createAnnouncement(AnnouncementRegisterReq req);

    // 단건 조회
    AnnouncementRes getAnnouncement(Long announcementId);

    // 목록 조회
    List<AnnouncementRes> getAnnouncementList();

    // 공지사항 수정 (관리자 계정 전용)
    AnnouncementRes updateAnnouncement(Long announcementId, AnnouncementRegisterReq req);

    // 공지사항 삭제 (관리자 계정 전용)
    void deleteAnnouncement(Long announcementId);
}

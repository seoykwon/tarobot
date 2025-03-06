package com.ssafy.api.service;

import com.ssafy.api.request.AnnouncementRegisterReq;
import com.ssafy.api.response.AnnouncementRes;
import com.ssafy.common.util.SecurityUtil;
import com.ssafy.db.entity.Announcement;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.AnnouncementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 공지사항 관련 비즈니스 로직 처리 (관리자 계정 전용)
 */
@Service("announcementService")
@RequiredArgsConstructor
@Transactional
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final SecurityUtil securityUtil;

    /**
     * 공지사항 생성 (관리자 전용)
     */
    @Override
    public AnnouncementRes createAnnouncement(AnnouncementRegisterReq req) {
        User currentUser = securityUtil.getCurrentUser();
        if (!currentUser.isAdmin()) {
            throw new SecurityException("관리자 권한이 필요합니다.");
        }
        Announcement announcement = new Announcement();
        announcement.setTitle(req.getTitle());
        announcement.setContent(req.getContent());
        Announcement savedAnnouncement = announcementRepository.save(announcement);
        return AnnouncementRes.of(savedAnnouncement);
    }

    /**
     * 공지사항 수정 (관리자 전용)
     */
    @Override
    public AnnouncementRes updateAnnouncement(Long announcementId, AnnouncementRegisterReq req) {
        User currentUser = securityUtil.getCurrentUser();
        if (!currentUser.isAdmin()) {
            throw new SecurityException("관리자 권한이 필요합니다.");
        }
        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new IllegalArgumentException("공지사항을 찾을 수 없습니다."));
        announcement.setTitle(req.getTitle());
        announcement.setContent(req.getContent());
        Announcement updatedAnnouncement = announcementRepository.save(announcement);
        return AnnouncementRes.of(updatedAnnouncement);
    }

    /**
     * 공지사항 삭제 (관리자 전용)
     */
    @Override
    public void deleteAnnouncement(Long announcementId) {
        User currentUser = securityUtil.getCurrentUser();
        if (!currentUser.isAdmin()) {
            throw new SecurityException("관리자 권한이 필요합니다.");
        }
        if (!announcementRepository.existsById(announcementId)) {
            throw new IllegalArgumentException("공지사항을 찾을 수 없습니다.");
        }
        announcementRepository.deleteById(announcementId);
    }

    /**
     * 공지사항 단건 조회 (관리자 권한 없이 조회 가능)
     */
    @Override
    public AnnouncementRes getAnnouncement(Long announcementId) {
        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new IllegalArgumentException("공지사항을 찾을 수 없습니다."));
        return AnnouncementRes.of(announcement);
    }

    /**
     * 공지사항 목록 조회 (관리자 권한 없이 조회 가능)
     */
    @Override
    public List<AnnouncementRes> getAnnouncementList() {
        List<Announcement> announcements = announcementRepository.findAll();
        // 최신 생성일 순으로 정렬
        announcements.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        return announcements.stream()
                .map(AnnouncementRes::of)
                .collect(Collectors.toList());
    }
}

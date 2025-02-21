package com.ssafy.api.controller;

import com.ssafy.api.request.AnnouncementRegisterReq;
import com.ssafy.api.response.AnnouncementRes;
import com.ssafy.api.service.AnnouncementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Announcement", description = "공지사항 API")
@RestController
@RequestMapping("/api/v1/community/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @Operation(summary = "공지사항 생성 (관리자 전용)", description = "관리자만 공지사항을 생성할 수 있습니다.")
    @PostMapping
    public ResponseEntity<AnnouncementRes> createAnnouncement(
            @RequestBody AnnouncementRegisterReq req) {
        AnnouncementRes res = announcementService.createAnnouncement(req);
        return ResponseEntity.ok(res);
    }

    @Operation(summary = "공지사항 조회",
            description = "공지사항 id(query 파라미터)가 있으면 상세 조회, 없으면 목록 조회를 합니다.")
    @GetMapping
    public ResponseEntity<?> getAnnouncements(
            @Parameter(description = "공지사항 ID (상세 조회를 위해 전달)", required = false)
            @RequestParam(value = "announcementId", required = false) Long announcementId) {
        if (announcementId != null) {
            AnnouncementRes res = announcementService.getAnnouncement(announcementId);
            return ResponseEntity.ok(res);
        } else {
            List<AnnouncementRes> list = announcementService.getAnnouncementList();
            return ResponseEntity.ok(list);
        }
    }

    @Operation(summary = "공지사항 수정 (관리자 전용)", description = "관리자만 공지사항을 수정할 수 있습니다.")
    @PutMapping("/{announcementId}")
    public ResponseEntity<AnnouncementRes> updateAnnouncement(
            @PathVariable Long announcementId,
            @RequestBody AnnouncementRegisterReq req) {
        AnnouncementRes res = announcementService.updateAnnouncement(announcementId, req);
        return ResponseEntity.ok(res);
    }

    @Operation(summary = "공지사항 삭제 (관리자 전용)", description = "관리자만 공지사항을 삭제할 수 있습니다.")
    @DeleteMapping("/{announcementId}")
    public ResponseEntity<Void> deleteAnnouncement(
            @PathVariable Long announcementId) {
        announcementService.deleteAnnouncement(announcementId);
        return ResponseEntity.noContent().build();
    }
}

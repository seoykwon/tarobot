package com.ssafy.api.response;

import com.ssafy.db.entity.Announcement;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 공지사항 정보 응답 객체 정의.
 */
@Getter
@Setter
@Schema(description = "Announcement Response")
public class AnnouncementRes {

    @Schema(description = "공지사항 ID", example = "1")
    private Long announcementId;

    @Schema(description = "공지사항 제목", example = "시스템 점검 안내")
    private String title;

    @Schema(description = "공지사항 내용", example = "내일 12시부터 2시까지 시스템 점검이 예정되어 있습니다.")
    private String content;

    @Schema(description = "등록 시간", example = "2025-01-23T12:00:00")
    private LocalDateTime createdAt;

    public static AnnouncementRes of(Announcement announcement) {
        AnnouncementRes res = new AnnouncementRes();
        res.setAnnouncementId(announcement.getId());
        res.setTitle(announcement.getTitle());
        res.setContent(announcement.getContent());
        res.setCreatedAt(announcement.getCreatedAt());
        return res;
    }
}

package com.ssafy.api.response;

import com.ssafy.db.entity.Diary;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 다이어리 정보 응답 객체 정의.
 */
@Getter
@Setter
@Schema(description = "Diary Response")
public class DiaryRes {

    @Schema(description = "다이어리 ID", example = "1")
    private Long id;

    @Schema(description = "상담 일자", example = "2024-01-23")
    private LocalDateTime consultDate;

    @Schema(description = "태그", example = "love, career")
    private String tag;

    @Schema(description = "상담 제목", example = "사랑 상담")
    private String title;

    @Schema(description = "상담 요약", example = "이번 상담에서는...")
    private String summary;

    @Schema(description = "타로 카드 이미지 URL", example = "http://example.com/tarot.jpg")
    private String cardImageUrl;

    @Schema(description = "타로봇 ID", example = "101")
    private Long tarotBotId;

    @Schema(description = "생성 시간", example = "2025-01-23T12:00:00")
    private LocalDateTime createdAt;

    @Schema(description = "수정 시간", example = "2025-01-23T15:30:00")
    private LocalDateTime updatedAt;

    public static DiaryRes of(Diary diary) {
        DiaryRes res = new DiaryRes();
        res.setId(diary.getId());
        res.setConsultDate(diary.getConsultDate().atStartOfDay());
        res.setTag(diary.getTag());
        res.setTitle(diary.getTitle());
        res.setSummary(diary.getSummary());
        res.setCardImageUrl(diary.getCardImageUrl());
        res.setTarotBotId(diary.getTarotBot().getId());
        res.setCreatedAt(diary.getCreatedAt());
        res.setUpdatedAt(diary.getUpdatedAt());
        return res;
    }
}

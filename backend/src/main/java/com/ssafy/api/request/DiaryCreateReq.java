package com.ssafy.api.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * 다이어리 생성 요청 객체.
 */
@Getter
@Setter
@Schema(description = "DiaryCreateRequest")
public class DiaryCreateReq {

    @Schema(description = "유저 ID", example = "1")
    private Long userId;

    @Schema(description = "상담 일자", example = "2024-01-23")
    private LocalDate consultDate;

    @Schema(description = "태그", example = "love, career")
    private String tag;

    @Schema(description = "상담 제목", example = "사랑 상담")
    private String title;

    @Schema(description = "상담 요약", example = "이번 상담에서는...")
    private String summary;

    @Schema(description = "타로 카드 이미지 URL", example = "http://example.com/tarot.jpg")
    private String cardImageUrl;
}

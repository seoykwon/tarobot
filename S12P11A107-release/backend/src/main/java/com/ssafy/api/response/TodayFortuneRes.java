package com.ssafy.api.response;

import com.ssafy.db.entity.TodayFortune;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Schema(description = "Today's Fortune Response")
public class TodayFortuneRes {

    @Schema(description = "오늘의 운세 ID", example = "1")
    private Long id;

    @Schema(description = "카드 이름", example = "행운의 카드")
    private String cardName;

    @Schema(description = "운세 결과", example = "오늘은 행운의 날!")
    private String fortune;

    @Schema(description = "점수", example = "85")
    private int luckyScore;

    @Schema(description = "운세가 적용되는 날짜", example = "2025-01-27")
    private LocalDate date;

    @Schema(description = "생성 시간", example = "2025-01-27T10:00:00")
    private LocalDateTime createdAt;

    @Schema(description = "수정 시간", example = "2025-01-27T12:00:00")
    private LocalDateTime updatedAt;

    @Schema(description = "사용자 ID", example = "ssafy_web")
    private String userId;

    @Schema(description = "타로 카드 ID", example = "1")
    private Long tarotCardId;

    @Schema(description = "타로 카드 이미지 URL", example = "https://example.com/card.png")
    private String tarotCardImageUrl;

    public static TodayFortuneRes of(TodayFortune todayFortune) {
        TodayFortuneRes res = new TodayFortuneRes();
        res.setId(todayFortune.getId());
        res.setCardName(todayFortune.getCardName());
        res.setFortune(todayFortune.getFortune());
        res.setLuckyScore(todayFortune.getLuckyScore());
        res.setDate(todayFortune.getDate());
        res.setCreatedAt(todayFortune.getCreatedAt());
        res.setUpdatedAt(todayFortune.getUpdatedAt());
        res.setUserId(todayFortune.getUser().getUserId());
        if (todayFortune.getTarotCard() != null) {
            res.setTarotCardId(todayFortune.getTarotCard().getId());
            res.setTarotCardImageUrl(todayFortune.getTarotCard().getCardImageUrl());
        }
        return res;
    }
}

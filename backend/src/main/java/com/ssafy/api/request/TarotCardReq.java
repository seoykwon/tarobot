package com.ssafy.api.request;

import io.swagger.v3.oas.annotations.media.Schema;import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

/**
 * 타로 카드 생성/수정 API (/api/v1/tarot-cards) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@Schema(description = "TarotCardRequest")

public class TarotCardReq {

    @Schema(description = "세트 번호", example = "1", required = true)
    private Integer setNumber; // 세트 번호

    @Schema(description = "카드 번호", example = "1", required = true)
    @Min(value = 0, message = "카드 번호는 0 이상이어야 합니다.")
    @Max(value = 78, message = "카드 번호는 78을 초과할 수 없습니다.")
    private Integer cardNumber; // 카드 번호

    @Schema(description = "카드 이미지 URL", example = "https://example.com/card1.jpg", required = true)
    private String cardImage; // 카드 이미지 URL
}

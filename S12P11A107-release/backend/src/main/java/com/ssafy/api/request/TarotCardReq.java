package com.ssafy.api.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * 타로 카드 생성/수정 API (/api/v1/tarot-cards) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@Schema(description = "TarotCardRequest")

public class TarotCardReq {

    @NotNull(message = "세트 번호는 필수 입력 항목입니다.")
    @Schema(description = "세트 번호", example = "1")
    private Integer setNumber; // 세트 번호

    @NotNull(message = "카드 번호는 필수 입력 항목입니다.")
    @Schema(description = "카드 번호", example = "1")
    @Min(value = 0, message = "카드 번호는 0 이상이어야 합니다.")
    @Max(value = 78, message = "카드 번호는 78을 초과할 수 없습니다.")
    private Integer cardNumber; // 카드 번호

    @NotBlank(message = "카드 이미지 URL은 필수 입력 항목입니다.")
    @Schema(description = "카드 이미지 URL", example = "https://example.com/card1.jpg")
    private String cardImage; // 카드 이미지 URL
}

package com.ssafy.api.response;

import com.ssafy.db.entity.TarotCard;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

/**
 * 타로 카드 정보 응답 객체 정의.
 */
@Getter
@Setter
@Schema(description = "TarotCardRes")
public class TarotCardRes {

    @Schema(description = "세트 번호")
    private Integer setNumber;

    @Schema(description = "카드 번호")
    private Integer cardNumber;

    @Schema(description = "카드 이미지 URL")
    private String cardImageUrl;

    public static TarotCardRes of(TarotCard tarotCard) {
        TarotCardRes res = new TarotCardRes();
        res.setSetNumber(tarotCard.getSetNumber());
        res.setCardNumber(tarotCard.getCardNumber());
        res.setCardImageUrl(tarotCard.getCardImageUrl());
        return res;
    }
}

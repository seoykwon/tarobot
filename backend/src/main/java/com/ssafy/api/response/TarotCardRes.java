package com.ssafy.api.response;

import com.ssafy.db.entity.TarotCard;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * 타로 카드 정보 응답 객체 정의.
 */
@Getter
@Setter
@ApiModel("TarotCardRes")
public class TarotCardRes {

    @ApiModelProperty(name = "세트 번호")
    private Integer setNumber;

    @ApiModelProperty(name = "카드 번호")
    private Integer cardNumber;

    @ApiModelProperty(name = "카드 이미지 URL")
    private String cardImage;

    public static TarotCardRes of(TarotCard tarotCard) {
        TarotCardRes res = new TarotCardRes();
        res.setSetNumber(tarotCard.getSetNumber());
        res.setCardNumber(tarotCard.getCardNumber());
        res.setCardImage(tarotCard.getCardImage());
        return res;
    }
}

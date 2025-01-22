package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

/**
 * 타로 카드 생성/수정 API 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@ApiModel("TarotCardRequest")
public class TarotCardRequest {

    @ApiModelProperty(name = "세트 번호", example = "1", required = true)
    private Integer setNumber; // 세트 번호

    @ApiModelProperty(name = "카드 번호", example = "1", required = true)
    @Min(value = 0, message = "Card number must be at least 0")
    @Max(value = 78, message = "Card number cannot exceed 78")
    private Integer cardNumber; // 카드 번호

    @ApiModelProperty(name = "카드 이미지 URL", example = "https://example.com/card1.jpg", required = true)
    private String cardImage; // 카드 이미지 URL
}

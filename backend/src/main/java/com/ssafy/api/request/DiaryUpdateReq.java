package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * 다이어리 업데이트 요청 객체.
 */
@Getter
@Setter
@ApiModel("DiaryUpdateRequest")
public class DiaryUpdateReq {

    @ApiModelProperty(name = "상담 일자", example = "2024-01-23")
    private LocalDate consultDate;

    @ApiModelProperty(name = "태그", example = "love, career")
    private String tag;

    @ApiModelProperty(name = "상담 제목", example = "사랑 상담")
    private String title;

    @ApiModelProperty(name = "상담 요약", example = "이번 상담에서는...")
    private String summary;

    @ApiModelProperty(name = "타로 카드 이미지 URL", example = "http://example.com/tarot.jpg")
    private String cardImageUrl;
}

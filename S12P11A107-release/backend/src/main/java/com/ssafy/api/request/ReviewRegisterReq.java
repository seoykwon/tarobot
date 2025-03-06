package com.ssafy.api.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Review Register Request")
public class ReviewRegisterReq {

    @NotNull(message = "별점은 필수 입력 항목입니다.")
    @Schema(description = "별점", example = "5")
    private Integer rating;

    @NotBlank(message = "리뷰 내용은 필수 입력 항목입니다.")
    @Schema(description = "리뷰 내용", example = "최고의 타로봇이에요!")
    private String content;
}

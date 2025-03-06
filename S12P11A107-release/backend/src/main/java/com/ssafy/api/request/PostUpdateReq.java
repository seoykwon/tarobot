package com.ssafy.api.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * 게시글 수정 API 요청에 필요한 DTO
 */
@Getter
@Setter
@Schema(description = "Post Update Request")
public class PostUpdateReq {
    @NotBlank(message = "게시글 제목은 필수 입력 항목입니다.")
    @Schema(description = "수정할 게시글 제목", example = "수정된 제목")
    private String title;

    @NotBlank(message = "게시글 내용은 필수 입력 항목입니다.")
    @Schema(description = "수정할 게시글 내용", example = "수정된 내용")
    private String content;

    @Schema(description = "수정할 이미지 URL", example = "https://example.com/updated_image.png")
    private String imageUrl;
}
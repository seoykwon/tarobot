package com.ssafy.api.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * 게시글 등록 API ([POST] /api/v1/posts) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@Schema(description = "Post Register Request")
public class PostRegisterReq {

    @NotBlank(message = "게시글 제목은 필수 입력 항목입니다.")
    @Schema(description = "게시글 제목", example = "오늘의 일상")
    private String title;

    @NotBlank(message = "게시글 내용은 필수 입력 항목입니다.")
    @Schema(description = "게시글 내용", example = "오늘은 정말 즐거운 하루였어요!")
    private String content;

    @Schema(description = "이미지 URL", example = "https://example.com/image.png")
    private String imageUrl;
}

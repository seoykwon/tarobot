package com.ssafy.api.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * 댓글 등록 API 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@Schema(description = "Comment Register Request")
public class CommentRegisterReq {

    @NotBlank(message = "댓글 내용은 필수 입력 항목입니다.")
    @Schema(description = "댓글 내용", example = "좋은 글이에요!")
    private String content;

    @NotNull(message = "게시글 ID는 필수 입력 항목입니다.")
    @Schema(description = "댓글이 달릴 게시글 ID", example = "1")
    private Long postId;
}

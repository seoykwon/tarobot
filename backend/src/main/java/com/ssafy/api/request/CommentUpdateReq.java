package com.ssafy.api.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * 댓글 수정 API 요청에 필요한 DTO
 */
@Getter
@Setter
@Schema(description = "Comment Update Request")
public class CommentUpdateReq {

    @NotBlank(message = "댓글 내용은 필수 입력 항목입니다.")
    @Schema(description = "수정할 댓글 내용", example = "수정된 댓글 내용")
    private String content;
}

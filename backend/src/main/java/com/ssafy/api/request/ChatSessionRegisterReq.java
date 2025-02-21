package com.ssafy.api.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "ChatSession Register Request")
public class ChatSessionRegisterReq {

    @NotNull(message = "봇 ID는 필수 입력 항목입니다.")
    @Schema(description = "세션에 참여할 봇 ID", example = "1")
    private Long botId;

    @NotNull(message = "세션 타이틀은 필수 입력 항목입니다.")
    @Schema(description = "세션의 제목", example = "건강운에 대한 상담")
    private String title;
}

package com.ssafy.api.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "ChatSession Register Request")
public class ChatSessionRegisterReq {

    @NotNull(message = "봇 ID는 필수 항목 입니다.")
    @Schema(description = "봇 ID", example = "1")
    private Long botId;
}

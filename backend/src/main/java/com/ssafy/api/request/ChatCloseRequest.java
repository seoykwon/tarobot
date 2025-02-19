package com.ssafy.api.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
@Schema(description = "Chat Clost Request")
public class ChatCloseRequest {
    @NotNull(message = "세션 ID는 필수 입력 항목입니다.")
    @Schema(description = "채팅에 사용할 세션 ID", example = "UUID")
    private UUID sessionId;

    @NotNull(message = "사용자 ID는 필수 입력 항목입니다.")
    @Schema(description = "사용자의 ID", example = "username@email.com")
    private String userId;

    @NotNull(message = "봇 ID는 필수 입력 항목입니다.")
    @Schema(description = "봇의 ID", example = "1")
    private Long botId;
}

package com.ssafy.api.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
@Schema(description = "Chat Send Request")
public class ChatMessageRequest {

    @NotNull(message = "세션 ID는 필수 입력 항목입니다.")
    @Schema(description = "채팅에 사용할 세션 ID", example = "UUID")
    private UUID sessionId;

    @NotNull(message = "봇에게 보낼 메시지는 필수 입력 항목입니다.")
    @Schema(description = "사용자의 채팅", example = "안녕!")
    private String userInput;

    @Schema(description = "채팅의 타입", example = "none/tarot")
    private String type;
}

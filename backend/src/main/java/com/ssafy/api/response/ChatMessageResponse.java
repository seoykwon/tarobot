package com.ssafy.api.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatMessageResponse {
    @Schema(description = "채팅 메시지", example = "안녕하세요!")
    private String botResponse;
}

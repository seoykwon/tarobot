package com.ssafy.api.response;

import com.ssafy.db.entity.ChatSession;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Schema(description = "ChatSession Response")
public class ChatSessionRes {

    @Schema(description = "���� ID", example = "UUID")
    private UUID sessionId;

    @Schema(description = "���� ����", example = "ACTIVATE")
    private String status;

    @Schema(description = "���� �ð�", example = "2025-01-23T12:00:00")
    private LocalDateTime createdAt;

    public static ChatSessionRes of(ChatSession chatSession) {
        ChatSessionRes res = new ChatSessionRes();
        res.setSessionId(chatSession.getSessionId());
        res.setStatus(chatSession.getStatus());
        res.setCreatedAt(chatSession.getCreatedAt());
        return res;
    }

}
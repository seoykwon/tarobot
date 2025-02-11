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

    @Schema(description = "세션 ID", example = "UUID")
    private UUID sessionId;

    @Schema(description = "유저 ID", example = "ssafy@naver.com")
    private String userId;

    @Schema(description = "세션 상태", example = "ACTIVATE")
    private String status;

    @Schema(description = "생성 시간", example = "2025-01-23T12:00:00")
    private LocalDateTime createdAt;

    public static ChatSessionRes of(ChatSession chatSession) {
        ChatSessionRes res = new ChatSessionRes();
        res.setSessionId(chatSession.getSessionId());
        res.setUserId(chatSession.getUserId());
        res.setStatus(chatSession.getStatus());
        res.setCreatedAt(chatSession.getCreatedAt());
        return res;
    }

}
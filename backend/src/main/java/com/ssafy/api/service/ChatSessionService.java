package com.ssafy.api.service;

import com.ssafy.db.entity.ChatSession;

import java.util.List;
import java.util.UUID;

public interface ChatSessionService {
    ChatSession createChatSession(Long botId, String title);
    ChatSession findBySessionId(UUID sessionId);
    List<ChatSession> findAllByUserId();
    List<ChatSession> findAllByUserIdAndBotId(Long botId);
    void updateLastAccessed(ChatSession session);
    void deleteChatSession(UUID sessionId);
    void summaryAndDiarySave(UUID sessionId, String userId, Long botId);
}

package com.ssafy.api.service;

import com.ssafy.db.entity.ChatSession;

import java.util.UUID;

public interface ChatSessionService {
    ChatSession createChatSession(Long botId);
    ChatSession findBySessionId(UUID sessionId);
    void updateLastAccessed(ChatSession session);
    void deleteChatSession(UUID sessionId);
}

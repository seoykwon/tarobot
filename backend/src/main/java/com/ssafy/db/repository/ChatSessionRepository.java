package com.ssafy.db.repository;

import com.ssafy.db.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChatSessionRepository extends JpaRepository<ChatSession, UUID> {
    List<ChatSession> findAllByUserIdOrderByUpdatedAtDesc(String userId);
    List<ChatSession> findAllByUserIdAndBotIdOrderByUpdatedAtDesc(String userId, Long BotId);
}

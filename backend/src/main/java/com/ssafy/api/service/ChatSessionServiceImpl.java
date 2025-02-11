package com.ssafy.api.service;

import com.ssafy.common.util.SecurityUtil;
import com.ssafy.db.entity.ChatSession;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.ChatSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatSessionServiceImpl implements ChatSessionService {

    private final ChatSessionRepository chatSessionRepository;

    private final SecurityUtil securityUtil;

    // 채팅방 입장 시 세션 생성 (생성시간은 @CreationTimestamp가 자동 할당)
    @Override
    public ChatSession createChatSession(Long botId) {
        ChatSession session = new ChatSession();

        // 인증 객체로 부터 유저를 불러와 Id 입력
        User currentUser = securityUtil.getCurrentUser();

        session.setUserId(currentUser.getUserId());
        session.setBotId(botId);
        session.setStatus("ACTIVE");
        return chatSessionRepository.save(session);
    }

    // 세션 ID로 조회
    @Override
    public ChatSession findBySessionId(UUID sessionId) {
        return chatSessionRepository.findById(sessionId).orElse(null);
    }

    // 저장 시 updatedAt 스탬프가 자동 업데이트 됨
    @Override
    public void updateLastAccessed(ChatSession session) {
        chatSessionRepository.save(session);
    }

    @Override
    @Transactional
    public void deleteChatSession(UUID sessionId) {
        ChatSession chatSession = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("세션을 찾을 수 없습니다."));
        chatSession.setStatus("CLOSED");
        chatSessionRepository.save(chatSession);
    }
}
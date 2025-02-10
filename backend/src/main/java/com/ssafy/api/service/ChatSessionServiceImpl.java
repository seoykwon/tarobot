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

    // ä�ù� ���� �� ���� ���� (�����ð��� @CreationTimestamp�� �ڵ� �Ҵ�)
    @Override
    public ChatSession createChatSession(Long botId) {
        ChatSession session = new ChatSession();

        // ���� ��ü�� ���� ������ �ҷ��� Id �Է�
        User currentUser = securityUtil.getCurrentUser();

        session.setUserId(currentUser.getUserId());
        session.setBotId(botId);
        session.setStatus("ACTIVE");
        return chatSessionRepository.save(session);
    }

    // ���� ID�� ��ȸ
    @Override
    public ChatSession findBySessionId(UUID sessionId) {
        return chatSessionRepository.findById(sessionId).orElse(null);
    }

    // ���� �� updatedAt �������� �ڵ� ������Ʈ ��
    @Override
    public void updateLastAccessed(ChatSession session) {
        chatSessionRepository.save(session);
    }

    @Override
    @Transactional
    public void deleteChatSession(UUID sessionId) {
        ChatSession chatSession = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("������ ã�� �� �����ϴ�."));
        chatSession.setStatus("CLOSED");
        chatSessionRepository.save(chatSession);
    }
}
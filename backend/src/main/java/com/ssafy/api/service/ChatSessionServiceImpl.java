package com.ssafy.api.service;

import com.ssafy.api.response.ChatSummaryRes;
import com.ssafy.common.util.SecurityUtil;
import com.ssafy.db.entity.ChatSession;
import com.ssafy.db.entity.Diary;
import com.ssafy.db.entity.TarotBot;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.ChatSessionRepository;
import com.ssafy.db.repository.DiaryRepository;
import com.ssafy.db.repository.TarotBotRepository;
import com.ssafy.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatSessionServiceImpl implements ChatSessionService {

    private final ChatSessionRepository chatSessionRepository;

    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;
    private final TarotBotRepository tarotBotRepository;

    private final SecurityUtil securityUtil;
    private final WebClient webClient;

    // 채팅방 입장 시 세션 생성 (생성시간은 @CreationTimestamp가 자동 할당)
    @Override
    public ChatSession createChatSession(Long botId, String title) {
        ChatSession session = new ChatSession();

        // 인증 객체로 부터 유저를 불러와 Id 입력
        User currentUser = securityUtil.getCurrentUser();
        session.setTitle(title);
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

    @Override
    public List<ChatSession> findAllByUserId() {
        User currentUser = securityUtil.getCurrentUser();
        String userId = currentUser.getUserId();
        return chatSessionRepository.findAllByUserIdOrderByUpdatedAtDesc(userId);
    }

    @Override
    public List<ChatSession> findAllByUserIdAndBotId(Long botId) {
        User currentUser = securityUtil.getCurrentUser();
        String userId = currentUser.getUserId();
        return chatSessionRepository.findAllByUserIdAndBotIdOrderByUpdatedAtDesc(userId, botId);
    }

    // 저장 시 updatedAt 스탬프가 자동 업데이트 됨
    @Override
    public void updateLastAccessed(ChatSession session) {
        session.setUpdatedAt(LocalDateTime.now());
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

    @Override
    public void summaryAndDiarySave(UUID sessionId, String userId, Long botId) {
        try {
            // ✅ FastAPI 응답을 DTO 객체로 매핑
            ChatSummaryRes response = webClient.post()
                    .uri("/chat/close")
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .bodyValue(Map.of("sessionId", sessionId.toString()))
                    .retrieve()
                    .bodyToMono(ChatSummaryRes.class) // ✅ DTO로 변환
                    .block();

            System.out.println("✅ Response from FastAPI: " + response);

            if (response != null) {
                User user = userRepository.findByUserId(userId)
                        .orElseThrow(() -> new RuntimeException("User not found with userId: " + userId));

                TarotBot tarotBot = tarotBotRepository.findById(botId).get();

                ChatSession session = chatSessionRepository.findById(sessionId).get();

                Diary diary = new Diary();
                diary.setUser(user);
                diary.setConsultDate(LocalDate.now());
                diary.setSummary(response.getSummary());
                diary.setTitle(response.getTitle());
                diary.setTag(String.join(", ", response.getTag()));
                diary.setCardImageUrl(response.getCardImageUrl());
                diary.setTarotBot(tarotBot);

                // 세션 업데이트
                session.setTitle(response.getTitle());
                chatSessionRepository.save(session);

                diaryRepository.save(diary);
                System.out.println("✅ Diary saved successfully with title: " + response.getTitle());
            } else {
                System.out.println("❌ No response received from FastAPI.");
            }

        } catch (Exception e) {
            System.out.println("비동기 요약 & 일지 저장 실패: " + e.getMessage());
        }
    }

}
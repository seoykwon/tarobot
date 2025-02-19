package com.ssafy.api.controller;

import com.ssafy.api.request.ChatCloseRequest;
import com.ssafy.api.request.ChatSessionRegisterReq;
import com.ssafy.api.response.ChatSessionRes;
import com.ssafy.api.service.ChatService;
import com.ssafy.api.service.ChatSessionService;
import com.ssafy.db.entity.ChatSession;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Tag(name = "ChatSession", description = "채팅 세션 API")
@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatSessionService chatSessionService;
    private final ChatService chatService;
    private final WebClient webClient; // FastAPI 요청을 위한 WebClient

    @Operation(summary = "채팅 세션 생성", description = "새로운 채팅 세션을 생성합니다.")
    @PostMapping("/session/enter")
    public ResponseEntity<ChatSessionRes> createChatSession(@RequestBody @Valid ChatSessionRegisterReq request) {
        // 현재 request에는 botId만 전달. userId는 인증 객체에서 자동으로 불러옴
        ChatSession session = chatSessionService.createChatSession(request.getBotId(), request.getTitle());
        return new ResponseEntity<>(ChatSessionRes.of(session), HttpStatus.CREATED);
    }

    @Operation(summary = "채팅 세션 상세 조회", description = "특정 채팅 세션의 정보를 조회합니다.")
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<ChatSessionRes> getChatSession(@PathVariable UUID sessionId) {
        ChatSession session = chatSessionService.findBySessionId(sessionId);
        return ResponseEntity.ok(ChatSessionRes.of(session));
    }

    @Operation(summary = "본인 세션 전체 조회", description = "본인의 세션의 정보들을 조회합니다.")
    @GetMapping("/session/me")
    public ResponseEntity<List<ChatSession>> getMyChatSessions() {
        List<ChatSession> sessions = chatSessionService.findAllByUserId();
        return ResponseEntity.ok(sessions);
    }

    @Operation(summary = "본인 세션 botID 기반 조회", description = "본인의 세션의 정보들을 타로 봇에 따라 조회합니다.")
    @GetMapping("/session/me/{botId}")
    public ResponseEntity<List<ChatSession>> getMyChatBotSessions(@PathVariable Long botId) {
        List<ChatSession> sessions = chatSessionService.findAllByUserIdAndBotId(botId);
        return ResponseEntity.ok(sessions);
    }

    @Operation(summary = "채팅 세션 수정", description = "채팅 세션의 상태나 정보를 수정합니다.")
    @PutMapping("/session/update/{sessionId}")
    public ResponseEntity<ChatSessionRes> updateChatSession(@PathVariable UUID sessionId) {
        ChatSession updatedSession = chatSessionService.findBySessionId(sessionId);
        chatSessionService.updateLastAccessed(updatedSession);
        return ResponseEntity.ok(ChatSessionRes.of(updatedSession));
    }

    @Operation(summary = "채팅 세션 정리", description = "채팅 세션을 종료(비활성화) 처리하고, 세션의 채팅 내역을 요약해 diary에 저장합니다.")
    @PostMapping("/session/close")
    public ResponseEntity<?> closeChat(@RequestBody ChatCloseRequest request) {
        // 1. 세션 종료 처리 (DB 업데이트, 로그 기록 등)
        chatSessionService.deleteChatSession(request.getSessionId());

        // 2. 요약 요청
        chatSessionService.summaryAndDiarySave(request.getSessionId(), request.getUserId());

        return ResponseEntity.ok(Map.of("message", "채팅 종료 처리 중"));
    }
}

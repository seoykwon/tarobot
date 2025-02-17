package com.ssafy.api.controller;

import com.ssafy.api.request.ChatCloseRequest;
import com.ssafy.api.request.ChatMessageRequest;
import com.ssafy.api.request.ChatSessionRegisterReq;
import com.ssafy.api.response.ChatMessageResponse;
import com.ssafy.api.response.ChatSessionRes;
import com.ssafy.api.service.ChatService;
import com.ssafy.api.service.ChatSessionService;
import com.ssafy.db.entity.ChatSession;
import com.ssafy.db.entity.Diary;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
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

    // 직접 수정할 일이 많이 있을까? 프론트에서 특정 동작을 했을 때 트리거를 다 따로 구현하기 때문에 의미가 많지 않을 듯 함
//    @Operation(summary = "채팅 세션 수정", description = "채팅 세션의 상태나 정보를 수정합니다.")
//    @PutMapping("/{sessionId}")
//    public ResponseEntity<ChatSessionRes> updateChatSession(@PathVariable UUID sessionId,
//                                                            @RequestBody @Valid ChatSessionUpdateReq request) {
//        ChatSession updatedSession = chatSessionService.updateChatSession(sessionId, request);
//        return ResponseEntity.ok(ChatSessionRes.of(updatedSession));
//    }
//
     // 이것도 세션 아이디를 지정해 종료할 일이 없을 듯
//    @Operation(summary = "채팅 세션 종료", description = "채팅 세션을 종료(비활성화) 처리합니다.")
//    @DeleteMapping("/session/{sessionId}")
//    public ResponseEntity<Void> deleteChatSession(@PathVariable UUID sessionId) {
//        chatSessionService.deleteChatSession(sessionId);
//        return ResponseEntity.ok().build();
//    }

    @Operation(summary = "채팅 세션 정리", description = "채팅 세션을 종료(비활성화) 처리하고, 세션의 채팅 내역을 요약해 diary에 저장합니다.")
    @PostMapping("/session/close")
    public ResponseEntity<?> closeChat(@RequestBody ChatCloseRequest request) {
        // 1. 세션 종료 처리 (DB 업데이트, 로그 기록 등)
        chatSessionService.deleteChatSession(request.getSessionId());

        // 2. 요약 요청
        chatSessionService.summaryAndDiarySave(request.getSessionId(), request.getUserId());

        return ResponseEntity.ok(Map.of("message", "채팅 종료 처리 중"));
    }




    // Spring Boot를 통한 채팅 기능은 Tomcat의 블로킹 기능에 의해 제한되어 사용하지 않음
//    @Operation(summary = "채팅 메시지 처리", description = "세션 ID와 메시지로 봇과 채팅을 주고 받습니다.")
//    @PostMapping
//    public ResponseEntity<ChatMessageResponse> sendMessage(@RequestBody ChatMessageRequest request) {
//        // 세션 Id에 해당하는 Session 찾기
//        ChatSession session = chatSessionService.findBySessionId(request.getSessionId());
//        if (session == null) {
//            return ResponseEntity.badRequest().build();
//        }
//        // 엔티티 업데이트를 통해 세션의 updatedAt 갱신
//        chatSessionService.updateLastAccessed(session);
//
//        // 세션 정보 내에 Session Id, User Id, Bot Id 다 있으니 이거랑 메시지 보내서 대화 주고받기
//        String botResponse = chatService.processMessage(request.getUserInput(), session, request.getType());
//        ChatMessageResponse response = new ChatMessageResponse(botResponse);
//        return ResponseEntity.ok(response);
//    }
//
//    @Operation(summary = "채팅 스트리밍", description = "스트리밍 방식으로 채팅 메시지를 주고받습니다.")
////    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
//    @PostMapping(value = "/stream")
//    public Flux<String> streamChat(@RequestBody ChatMessageRequest request) {
//        // 세션 ID로 세션 찾기
//        ChatSession session = chatSessionService.findBySessionId(request.getSessionId());
//        if (session == null) {
//            return Flux.error(new IllegalArgumentException("세션을 찾을 수 없습니다."));
//        }
//
//        // 세션 updatedAt 갱신
//        chatSessionService.updateLastAccessed(session);
//
//        return chatService.getChatStream(request.getUserInput(), session, request.getType());
//    }
}

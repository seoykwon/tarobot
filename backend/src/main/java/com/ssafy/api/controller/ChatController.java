package com.ssafy.api.controller;

import com.ssafy.api.request.ChatMessageRequest;
import com.ssafy.api.request.ChatSessionRegisterReq;
import com.ssafy.api.response.ChatMessageResponse;
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
import reactor.core.publisher.Flux;

import java.util.UUID;

@Tag(name = "ChatSession", description = "채팅 세션 API")
@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatSessionService chatSessionService;
    private final ChatService chatService;

    @Operation(summary = "채팅 세션 생성", description = "새로운 채팅 세션을 생성합니다.")
    @PostMapping("/session/enter")
    public ResponseEntity<ChatSessionRes> createChatSession(@RequestBody @Valid ChatSessionRegisterReq request) {
        // 현재 request에는 botId만 전달. userId는 인증 객체에서 자동으로 불러옴
        ChatSession session = chatSessionService.createChatSession(request.getBotId());
        return new ResponseEntity<>(ChatSessionRes.of(session), HttpStatus.CREATED);
    }

    @Operation(summary = "채팅 세션 상세 조회", description = "특정 채팅 세션의 정보를 조회합니다.")
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<ChatSessionRes> getChatSession(@PathVariable UUID sessionId) {
        ChatSession session = chatSessionService.findBySessionId(sessionId);
        return ResponseEntity.ok(ChatSessionRes.of(session));
    }

//    @Operation(summary = "채팅 세션 수정", description = "채팅 세션의 상태나 정보를 수정합니다.")
//    @PutMapping("/{sessionId}")
//    public ResponseEntity<ChatSessionRes> updateChatSession(@PathVariable UUID sessionId,
//                                                            @RequestBody @Valid ChatSessionUpdateReq request) {
//        ChatSession updatedSession = chatSessionService.updateChatSession(sessionId, request);
//        return ResponseEntity.ok(ChatSessionRes.of(updatedSession));
//    }

    @Operation(summary = "채팅 세션 종료", description = "채팅 세션을 종료(비활성화) 처리합니다.")
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<Void> deleteChatSession(@PathVariable UUID sessionId) {
        chatSessionService.deleteChatSession(sessionId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "채팅 메시지 처리", description = "세션 ID와 메시지로 봇과 채팅을 주고 받습니다.")
    @PostMapping
    public ResponseEntity<ChatMessageResponse> sendMessage(@RequestBody ChatMessageRequest request) {
        // 세션 Id에 해당하는 Session 찾기
        ChatSession session = chatSessionService.findBySessionId(request.getSessionId());
        if (session == null) {
            return ResponseEntity.badRequest().build();
        }
        // 엔티티 업데이트를 통해 세션의 updatedAt 갱신
        chatSessionService.updateLastAccessed(session);

        // 세션 정보 내에 Session Id, User Id, Bot Id 다 있으니 이거랑 메시지 보내서 대화 주고받기
        String botResponse = chatService.processMessage(request.getUserInput(), session, request.getType());
        ChatMessageResponse response = new ChatMessageResponse(botResponse);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "채팅 스트리밍", description = "스트리밍 방식으로 채팅 메시지를 주고받습니다.")
//    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @PostMapping(value = "/stream")
    public Flux<String> streamChat(@RequestBody ChatMessageRequest request) {
        // 세션 ID로 세션 찾기
        ChatSession session = chatSessionService.findBySessionId(request.getSessionId());
        if (session == null) {
            return Flux.error(new IllegalArgumentException("세션을 찾을 수 없습니다."));
        }

        // 세션 updatedAt 갱신
        chatSessionService.updateLastAccessed(session);

        return chatService.getChatStream(request.getUserInput(), session, request.getType());
    }
}

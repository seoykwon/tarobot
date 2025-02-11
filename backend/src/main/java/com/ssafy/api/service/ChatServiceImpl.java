package com.ssafy.api.service;

import com.ssafy.db.entity.ChatSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final WebClient webClient;


    @Override
    public String processMessage(String userInput, ChatSession session, String type) {
        return webClient.post()
                .uri("/chat/process")
                .bodyValue(Map.of(
                        "session_id", session.getSessionId().toString(),
                        "user_input", userInput,
                        "type", type
                ))
                .retrieve()
                .bodyToMono(String.class)
                .block(); // 비동기 방식이 필요하지 않다면 block() 사용
    }

    /**
     * FastAPI의 /chat/stream 엔드포인트에 요청을 보내 스트리밍 응답을 받아옵니다.
     *
     * @param userInput 사용자가 입력한 메시지
     * @param session   채팅 세션 엔티티 (sessionId를 포함)
     * @param type      (옵션) 요청 타입
     * @return FastAPI로부터 전달받은 스트리밍 문자열 Flux
     */

    public Flux<String> getChatStream(String userInput, ChatSession session, String type) {
        return webClient.post()
                .uri("/chat/stream")
                .header(HttpHeaders.ACCEPT, MediaType.TEXT_EVENT_STREAM_VALUE)
                .header(HttpHeaders.TRANSFER_ENCODING, "chunked")
                .bodyValue(Map.of(
                        "session_id", session.getSessionId().toString(),
                        "user_input", userInput,
                        "type", type
                ))
                .retrieve()
                .bodyToFlux(String.class);
    }

}

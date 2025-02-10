package com.ssafy.api.service;

import com.ssafy.db.entity.ChatSession;
import reactor.core.publisher.Flux;

public interface ChatService {
    public String processMessage(String userInput, ChatSession session, String type);
    Flux<String> getChatStream(String userInput, ChatSession session, String type);
}

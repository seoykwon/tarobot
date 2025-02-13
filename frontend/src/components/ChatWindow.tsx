"use client";

import { useState, useRef, useEffect } from "react";
import { API_URLS } from "@/config/api";
import ChatInput from "./ChatInput";

export default function ChatWindow() {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 사용자가 메시지를 전송하면 실행되는 로직 (스트리밍 응답을 실시간 반영)
  const handleSendMessage = async (message: string) => {
    // 사용자의 메시지를 채팅에 추가
    setMessages((prev) => [...prev, { text: message, isUser: true }]);
    // 봇 응답 자리로 "입력중...."를 먼저 보여줌
    setMessages((prev) => [...prev, { text: "입력중....", isUser: false }]);
    let botMessageText = "";

    try {
      // FastAPI 스트리밍 엔드포인트에 POST 요청 전송
      const response = await fetch(API_URLS.CHAT.STREAM("123123", message, "chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: message }),
      });

      if (!response.body) throw new Error("Response body is null");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // 스트리밍 응답을 읽어오면서 받은 청크를 누적하고 메시지 업데이트
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        botMessageText += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { text: botMessageText, isUser: false };
          return updated;
        });
      }
    } catch (error) {
      console.error("Streaming response error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { text: "Error retrieving response", isUser: false };
        return updated;
      });
    }
  };

  // 새로운 메시지가 추가될 때마다 스크롤을 자동으로 맨 아래로 이동
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-purple-100">
      {/* 채팅 로그 영역 (독립 스크롤 컨테이너) */}
      <div
        ref={chatContainerRef}
        className="flex-1 px-6 py-4 space-y-4 overflow-auto"
        style={{ marginBottom: "4rem" }} // 입력창 높이만큼 여백 추가
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.isUser ? "justify-end" : "justify-start"} w-full`}
          >
            {msg.isUser ? (
              // 사용자 메시지 (오른쪽 정렬)
              <div className="px-4 py-2 rounded-l-lg rounded-br-lg max-w-xs bg-gray-800 text-white">
                {msg.text}
              </div>
            ) : (
              // 봇 메시지 (화면 전체 너비 사용)
              <div className="px-10 pr-20 py-6 rounded-lg text-black w-full text-2xl leading-relaxed">
                {msg.text}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* 하단 입력창 */}
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
}

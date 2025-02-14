"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URLS } from "@/config/api";
import ChatInput from "@/components/ChatInput";

export default function ChatStandby() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);

  const handleFirstMessage = async (message: string) => {
    try {
      const botId = localStorage.getItem("botId");
      const response = await fetch(API_URLS.CHAT.ENTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botId }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("세션 생성 실패");

      const data = await response.json();
      localStorage.setItem("sessionId", data.sessionId);
      localStorage.setItem("firstMessage", message); // ✅ 첫 메시지 저장

      router.push(`/chat/${data.sessionId}`);
    } catch (error) {
      console.error("세션 생성 에러:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-purple-100">
      {/* 채팅 로그 영역 */}
      <div className="flex-1 px-6 py-4 space-y-4 overflow-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.isUser ? "justify-end" : "justify-start"} w-full`}>
            <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.isUser ? "bg-gray-800 text-white" : "bg-purple-400 text-gray"}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* 채팅 입력창 */}
      <ChatInput
        onSend={(message) => {
          setMessages([...messages, { text: message, isUser: true }]);
          handleFirstMessage(message);
        }}
      />
    </div>
  );
}

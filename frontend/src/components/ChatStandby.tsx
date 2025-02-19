// chatstandby.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URLS } from "@/config/api";
import ChatInput from "@/components/ChatInput";
import { useSession } from "@/context/SessionContext";

export default function ChatStandby() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const { triggerSessionUpdate } = useSession(); // 세션 업데이트를 위한 트리거

  // 클라이언트 사이드에서 localStorage 접근
  const botId = typeof window !== "undefined" ? localStorage.getItem("botId") : null;

  // 사용자가 첫 메시지를 입력 시, API를 호출하여 새로운 세션을 생성하고 채팅 페이지로 이동합니다.
  const handleFirstMessage = async (message: string) => {
    try {
      const title = message;
      const response = await fetch(API_URLS.CHAT.ENTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botId, title }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("세션 생성 실패");

      const data = await response.json();
      localStorage.setItem("firstMessage", message);

      // 세션 생성 후 전역 업데이트 트리거 실행
      triggerSessionUpdate();

      // 새로운 채팅 세션 페이지로 이동합니다.
      router.push(`/chat/${data.sessionId}`);
    } catch (error) {
      console.error("세션 생성 에러:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-purple-100">
      {/* 채팅 메시지 영역 */}
      <div className="flex-1 px-6 py-4 space-y-4 overflow-auto bg-purple-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex w-full ${msg.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                msg.isUser ? "bg-gray-800 text-white" : "bg-purple-400 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      {/* 하단 입력창 컴포넌트 */}
      <ChatInput
        onSend={(message: string) => {
          // 사용자가 보낸 메시지를 로컬 상태에 추가하고 새 세션 생성을 요청합니다.
          setMessages([...messages, { text: message, isUser: true }]);
          handleFirstMessage(message);
        }}
        sessionId="none"
      />
    </div>
  );
}

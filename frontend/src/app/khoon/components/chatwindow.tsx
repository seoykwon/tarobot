// components/ChatWindow.tsx
"use client"

import { useState, useRef, useEffect } from "react";

export default function ChatWindow() {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null); // 스크롤 자동 이동

  // 메시지를 추가하고 챗봇 응답을 추가
  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    const botMessage = { text: `Echo: ${input}`, isUser: false }; // EchoBot 응답

    setMessages((prev) => [...prev, userMessage]); // 사용자 메시지 추가

    setTimeout(() => {
      setMessages((prev) => [...prev, botMessage]); // 챗봇 응답 추가
    }, 500);

    setInput(""); // 입력 필드 초기화
  };

  // 엔터 키 입력 처리
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // 채팅이 업데이트될 때 스크롤을 아래로 자동 이동
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 p-6 bg-purple-50 flex flex-col">
      {/* 채팅 메시지 영역 */}
      <div className="flex-1 overflow-y-auto h-[70vh]">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.isUser ? "justify-end" : "justify-start"} my-2`}>
            <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.isUser ? "bg-gray-800 text-white" : "bg-gray-300"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {/* 스크롤 자동 이동을 위한 ref */}
        <div ref={chatEndRef} />
      </div>

      {/* 입력 필드 + 버튼 */}
      <div className="flex items-center gap-2 mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress} // 엔터 키 이벤트 추가
          placeholder="타로 마스터와 대화를 나눠보세요."
          className="flex-1 p-2 border rounded-lg"
        />
        <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          ↑ {/* 화살표 버튼 */}
        </button>
      </div>
    </div>
  );
}

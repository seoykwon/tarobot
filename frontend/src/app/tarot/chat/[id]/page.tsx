"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "안녕하세요! 무엇을 도와드릴까요?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const chatContainerRef = useRef<HTMLDivElement>(null); // 스크롤 컨트롤을 위한 Ref

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true); // 로딩 상태 활성화

    try {
      // fetch를 사용하여 POST 요청
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from server");
      }

      const data = await response.json();
      const botMessage = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error occurred while fetching response." },
      ]);
    } finally {
      setIsLoading(false); // 로딩 상태 비활성화
    }
  };

  // 새로운 메시지가 추가될 때 자동으로 스크롤 하단으로 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    /* 채팅 필드 */
    <div className="min-h-screen bg-gray-900 font-tarobot-description p-4 pb-24 flex flex-col justify-between">
      {/* 채팅 메시지 컨테이너 */}
      <div
        ref={chatContainerRef}
        className="flex flex-col space-y-4 overflow-y-auto mb-4 pb-16"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg ${
              msg.sender === "user" ? "bg-gray-700 self-end" : "bg-purple-600 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {/* 로딩 중일 때 '입력 중...' 표시 */}
        {isLoading && (
          <div className="p-2 rounded-lg bg-purple-600 self-start">
            입력 중...
          </div>
        )}
      </div>

      {/* 입력 필드 */}
      <div className="fixed bottom-4 left-0 right-0 px-4 z-50">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 rounded-lg bg-gray-800 text-white"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading} // 로딩 중일 때 버튼 비활성화
            className={`p-2 rounded-lg ${
              isLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-fuchsia-500 hover:bg-fuchsia-600 text-white"
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

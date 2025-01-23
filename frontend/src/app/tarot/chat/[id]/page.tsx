"use client";

import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // 사용자 메시지 추가
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    // API 요청
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: input }),
    });

    const data = await response.json();

    // 챗봇 응답 추가
    const botMessage = { sender: "bot", text: data.reply };
    setMessages((prev) => [...prev, botMessage]);

    setInput(""); // 입력 필드 초기화
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="flex flex-col space-y-4 mb-16">
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
      </div>
        {/* 입력 필드 */}
      <div className="fixed bottom-4 left-0 right-0 px-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 rounded-lg bg-gray-800 text-white"
          />
          <button onClick={sendMessage} className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white p-2 rounded-lg">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

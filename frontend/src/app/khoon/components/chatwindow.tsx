"use client";

import { useState, useRef, useEffect } from "react";
import ChatInput from "@/app/khoon/components/ChatInput";

export default function ChatWindow() {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (message: string) => {
    const userMessage = { text: message, isUser: true };
    const botMessage = { text: `Echo: ${message}`, isUser: false };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full md:h-screen bg-purple-100">
      <div ref={chatContainerRef} className="flex-1 px-6 py-4 space-y-2 overflow-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
            <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.isUser ? "bg-gray-800 text-white" : "bg-gray-300"}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* ✅ 하단 입력창 */}
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
}

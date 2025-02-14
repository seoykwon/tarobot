"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URLS } from "@/config/api";
import ChatInput from "@/components/ChatInput";
import Image from "next/image";

export default function ChatStandby() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  
  const botId = localStorage.getItem("botId");
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      localStorage.setItem("sessionId", data.sessionId);
      localStorage.setItem("firstMessage", message);
      router.push(`/chat/${data.sessionId}`);
    } catch (error) {
      console.error("세션 생성 에러:", error);
    }
  };

  return (
    <div className={`${isMobile ? "relative h-screen" : "flex flex-col h-screen bg-purple-100"}`}>
      {isMobile && (
        <div className="absolute inset-0">
          <Image
            src="/images/dummy1.png"
            alt="배경 이미지"
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className={`${isMobile ? "relative z-10 flex flex-col h-screen bg-[rgba(70,35,10,0.3)]" : "flex flex-col h-screen"}`}>
        <div className="flex-1 px-6 py-4 space-y-4 overflow-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.isUser ? "justify-end" : "justify-start"} w-full`}>
              <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.isUser ? "bg-gray-800 text-white" : "bg-purple-400 text-gray"}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <ChatInput
          onSend={(message) => {
            setMessages([...messages, { text: message, isUser: true }]);
            handleFirstMessage(message);
          }}
        />
      </div>
    </div>
  );
}

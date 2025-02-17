"use client";

import { useState } from "react";
import VoiceChat from "@/components/VoiceChat";

interface ChatInputProps {
  onSend: (message: string) => void;
  sessionId: string;
}

export default function ChatInput({ onSend, sessionId }: ChatInputProps) {
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white px-6 py-3 border-t flex items-center">
      <div className="relative flex-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="메시지를 입력하세요..."
          className="w-full p-2 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {/* 버튼은 input 값이 있을 때만 렌더링 */}
        {/* {input.trim() && (
          <button
            onClick={sendMessage}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            ↑
          </button>
        )} */}
        <button
          onClick={input.trim() ? sendMessage : () => console.log("음성 입력 시작")}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
        >
          <span className={`transition-opacity duration-200 ${input.trim() ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
            ↑
          </span>
          <span className={`transition-opacity duration-200 absolute inset-0 ${input.trim() ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}>
            {/* 🎤 */}
            <VoiceChat roomId={sessionId} />
          </span>
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import VoiceChat from "@/components/Chat/Input/VoiceChat";
import InviteFriend from "@/components/Chat/Input/InviteFriend";
import NextImage from "next/image";

interface ChatInputProps {
  onSend: (message: string) => void;
  sessionId: string;
}

export default function ChatInput({ onSend, sessionId }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white/50 px-6 py-3 rounded-lg flex items-center relative divide-x divide-gray-300">
      {/* 배경 클릭 시 오버레이 닫기 위한 Backdrop */}
      {showOverlay && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowOverlay(false)}
        />
      )}
  
      {/* 확대된 + 버튼 - 버튼 클릭 시 토글 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowOverlay((prev) => !prev);
        }}
        className="mr-3 p-3 bg-transparent hover:bg-gray-200 rounded-full transition-all duration-200 w-12 h-12 flex items-center justify-center"
      >
        <NextImage
          src="/kakao_logo.svg"
          alt="카카오 초대 링크"
          width={32}
          height={32}
          className="w-8 h-8"
        />
      </button>
  
      {/* 오버레이 표시 */}
      {showOverlay && (
        <InviteFriend 
          onClose={() => setShowOverlay(false)}
          className="absolute bottom-20 left-4 z-50 shadow-xl"
        />
      )}
  
      {/* 메시지 입력 필드 */}
      <div className="relative flex-1 pl-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="메시지를 입력하세요..."
        className="w-full p-4 border border-gray-300 rounded-full outline-none transition-all"
      />
        
        {input.trim() ? (
          <button
            onClick={sendMessage}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 px-4 py-2 bg-transparent text-black rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center w-12 h-12">

            ↑
          </button>):(

          <button
          onClick={() => console.log("음성 입력")}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 px-4 py-2 bg-transparent text-black rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center w-12 h-12">
            <VoiceChat roomId={sessionId} />
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import VoiceChat from "@/components/VoiceChat";
import InviteFriend from "./Chat/InviteFriend";
import NextImage from "next/image";

interface ChatInputProps {
  onSend: (message: string) => void;
  sessionId: string;
  // 새로 추가: onInputChange
  onInputChange?: (value: string) => void;
}

export default function ChatInput({ onSend, sessionId, onInputChange }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const typingStopRef = useRef<NodeJS.Timeout | null>(null);

  // 메시지 전송
  const handleSendMessage = () => {
    if (!input.trim()) return;
    console.log("🔼 [send] 사용자 입력 전송:", input);
    onSend(input);
    setInput("");
  };

  // 입력 변화 감지
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);

    // onInputChange 호출 -> typing_start 등
    try {
      onInputChange?.(val);
    } catch (err) {
      console.error("onInputChange error:", err);
    }

    // 300ms 디바운스로 typing_stop 가정
    if (typingStopRef.current) clearTimeout(typingStopRef.current);
    typingStopRef.current = setTimeout(() => {
      // ex) socketRef.current?.emit("typing_stop", { room_id: sessionId });
      // 여기는 로직만 남겨둠
    }, 300);
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white/50 px-6 py-3 rounded-lg flex items-center relative divide-x divide-gray-300">
      {showOverlay && <div className="fixed inset-0 z-40" onClick={() => setShowOverlay(false)} />}

      {/* 버튼 대신 div로 교체해 button 중첩 문제 해결 */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          setShowOverlay((prev) => !prev);
        }}
        className="mr-3 p-3 bg-transparent hover:bg-gray-200 rounded-full transition-all duration-200 w-12 h-12 flex items-center justify-center cursor-pointer"
        role="button"
        tabIndex={0}
      >
        <NextImage
          src="/kakao_logo.svg"
          alt="카카오 초대 링크"
          width={32}
          height={32}
          className="w-8 h-8"
        />
      </div>

      {showOverlay && (
        <InviteFriend
          onClose={() => setShowOverlay(false)}
          className="absolute bottom-20 left-4 z-50 shadow-xl"
        />
      )}

      <div className="relative flex-1 pl-4">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="메시지를 입력하세요..."
          className="w-full p-4 border border-gray-300 rounded-full outline-none transition-all"
        />

        {input.trim() ? (
          <button
            onClick={handleSendMessage}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 px-4 py-2 bg-transparent text-black rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center w-12 h-12"
          >
            ↑
          </button>
        ) : (
          <button
            onClick={() => console.log("음성 입력")}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 px-4 py-2 bg-transparent text-black rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center w-12 h-12"
          >
            <VoiceChat roomId={sessionId} />
          </button>
        )}
      </div>
    </div>
  );
}

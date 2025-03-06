"use client";

import { useState, useRef } from "react";
import { Socket } from "socket.io-client";
import VoiceChat from "@/components/Chat/Input/VoiceChat";
import InviteFriend from "@/components/Chat/Input/InviteFriend";
import NextImage from "next/image";

interface ChatInputProps {
  onSend: (message: string) => void;
  sessionId: string;
  socketRef: React.MutableRefObject<Socket | null>; // 상위에서 socket 객체 주입
  onInputChange?: (value: string) => void;
}

export default function ChatInput({ onSend, sessionId, socketRef, onInputChange }: ChatInputProps) {
  const [input, setInput] = useState("");
  const typingStopTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // 메시지 전송
  const handleSendMessage = () => {
    if (!input.trim()) return;
  
    console.log("🔼 [send] 사용자 입력 전송:", input);
    onSend(input);
  
    // 1) 입력창 비우기
    setInput("");
  
    // 2) Enter로 전송했으므로, 1초 뒤 typing_stop을 보냄
    if (typingStopTimerRef.current) {
      clearTimeout(typingStopTimerRef.current);
    }
    typingStopTimerRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        console.log(`[ChatInput] => typing_stop (after 1s from Enter)`);
        isTypingRef.current = false;
        socketRef.current?.emit("typing_stop", { room_id: sessionId });
      }
    }, 1000);
  };
 

  // 입력 변화 감지
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
  
    // (1) 부모로 입력값 전달 (5초 idle 매크로 등)
    onInputChange?.(val);
  
    // (2) typing_start / typing_stop 처리
    if (val.trim().length > 0) {
      // ✅ 즉시 typing_start 전송
      if (!isTypingRef.current) {
        console.log(`[ChatInput] => typing_start (immediate)`);
        isTypingRef.current = true;
        socketRef.current?.emit("typing_start", { room_id: sessionId });
      }
  
      // ✅ 기존의 typing_stop 타이머를 취소
      if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
    } else {
      // ✅ 입력이 비어졌으면, 1초 뒤 typing_stop 실행
      if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
      typingStopTimerRef.current = setTimeout(() => {
        if (isTypingRef.current) {
          console.log(`[ChatInput] => typing_stop (after 1s)`);
          isTypingRef.current = false;
          socketRef.current?.emit("typing_stop", { room_id: sessionId });
        }
      }, 1000);
    }
  };
  

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Enter 전송 시 typing_stop은 보내지 않음 (요구사항)
      handleSendMessage();
    }
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
          onKeyDown={handleKeyDown}
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
            {/* <VoiceChat roomId={sessionId} /> */}
          </button>
        )}
      </div>
    </div>
  );
}

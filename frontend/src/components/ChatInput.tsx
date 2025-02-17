"use client";

import { useState } from "react";
import InviteFriend from "./Chat/InviteFriend";

export default function ChatInput({ onSend }: { onSend: (message: string) => void }) {
  const [input, setInput] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white px-6 py-3 border-t flex items-center relative">
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
          e.stopPropagation(); // 이벤트 버블링 방지하여 backdrop과의 충돌 방지
          setShowOverlay((prev) => !prev);
        }}
        className="mr-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-full 
                   transition-all duration-200 w-12 h-12 flex 
                   items-center justify-center"
      >
        <span className="text-2xl text-blue-600 font-bold">+</span>
      </button>

      {/* 오버레이 표시 */}
      {showOverlay && (
        <InviteFriend 
          onClose={() => setShowOverlay(false)}
          className="absolute bottom-20 left-4 z-50 shadow-xl"
        />
      )}

      {/* 메시지 입력 필드 */}
      <div className="relative flex-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="메시지를 입력하세요..."
          className="w-full p-4 pr-16 border-2 border-gray-200 
                   rounded-xl focus:ring-4 focus:ring-blue-300 
                   outline-none transition-all"
        />
        
        {/* 전송/음성 버튼 */}
        <button
          onClick={input.trim() ? sendMessage : () => console.log("음성 입력")}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 
                   px-4 py-2 bg-blue-600 text-white rounded-xl 
                   hover:bg-blue-700 transition-all duration-200
                   flex items-center justify-center w-12 h-12"
        >
          <span className={`transition-opacity ${input.trim() ? "opacity-100" : "opacity-0"}`}>
            ↑
          </span>
          <span className={`absolute transition-opacity ${input.trim() ? "opacity-0" : "opacity-100"}`}>
            🎤
          </span>
        </button>
      </div>
    </div>
  );
}

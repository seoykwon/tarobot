"use client";

import { useState } from "react";

export default function ChatInput({ onSend }: { onSend: (message: string) => void }) {
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
        {input.trim() && (
          <button
            onClick={sendMessage}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            ↑
          </button>
        )}
      </div>
    </div>
  );
}

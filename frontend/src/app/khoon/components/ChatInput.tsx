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
    <div className="sticky bottom-0 left-0 right-0 bg-white px-6 py-3 border-t flex items-center gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="메시지를 입력하세요..."
        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      />
      <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        ↑
      </button>
    </div>
  );
}

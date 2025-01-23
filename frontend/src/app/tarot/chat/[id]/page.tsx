"use client";

import { useState } from "react";
import axios from "axios";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "안녕하세요! 무엇을 도와드릴까요?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post("/api/chat", { message: input });
      const botMessage = { sender: "bot", text: response.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error occurred while fetching response." },
      ]);
    }

    setInput("");
  };

  return (

    /* 채팅 필드 */
    <div className="min-h-screen bg-gray-900 text-white p-4 pb-24 flex flex-col justify-between">
      <div className="flex flex-col space-y-4 overflow-y-auto mb-4">
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
      <div className="fixed bottom-4 left-0 right-0 px-4 z-50">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 rounded-lg bg-gray-800 text-white"
          />
          <button
            onClick={sendMessage}
            className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white p-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

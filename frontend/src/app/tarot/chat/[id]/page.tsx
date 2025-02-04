"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { sender: "bot", text: "안녕하세요! 무엇을 도와드릴까요?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const chatContainerRef = useRef<HTMLDivElement>(null); // 스크롤 컨트롤을 위한 Ref

  const sessionId = "abc123"; // 예시 세션 ID (실제 세션 ID를 백엔드에서 받아와야 함)
  const userId = 123; // 예시 사용자 ID (실제 사용자 ID를 받아와야 함)

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true); // 로딩 상태 활성화

    try {
      // fetch를 사용하여 POST 요청
      // const response = await fetch("http://127.0.0.1:8000/chat", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ session_id: sessionId, user_input: input }),
      // });
      // console.log(typeof input, input);
      // if (!response.ok) {
      //   throw new Error("Failed to fetch response from server");
      // }
      // const data = await response.json();
      // const botMessage = { sender: "bot", text: data.reply };

      // 챗봇 쪽을 바꿔야 할 거 같긴 한데, 일단 테스트 용으로 query로 보내기
      // 쿼리 스트링으로 session_id와 user_input을 포함
      const queryParams = new URLSearchParams({
        session_id: sessionId,
        user_input: input,
      }).toString();

      const response = await fetch(`http://127.0.0.1:8000/chat?${queryParams}`, {
        method: "POST",  // FastAPI가 GET이 아니라 POST를 사용하고 있으므로 유지
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log(data);
      const botMessage = { sender: "bot", text: data.answer };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error occurred while fetching response." },
      ]);
    } finally {
      setIsLoading(false); // 로딩 상태 비활성화
    }
  };

  // 상담 종료하기 버튼 클릭 핸들러
  const handleEndChat = async () => {
    try {
      const response = await fetch(`/main/chat/${sessionId}/close`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }), // 사용자 ID 전송
      });

      if (!response.ok) {
        throw new Error("Failed to close chat session");
      }

      const data = await response.json();
      console.log(data.message); // 성공 메시지 출력

      // 상담 종료 후 처리 (예: 홈 화면으로 이동)
      alert("상담이 종료되었습니다.");
      router.push("/home"); // 홈 페이지로 리다이렉트
    } catch (error) {
      console.error("Error closing chat session:", error);
      alert("상담 종료 중 오류가 발생했습니다.");
    }
  };

  // 새로운 메시지가 추가될 때 자동으로 스크롤 하단으로 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    /* 채팅 필드 */
    <div className="min-h-screen bg-gray-900 font-tarobot-description p-4 pb-24 flex flex-col justify-between">
      {/* 채팅 메시지 컨테이너 */}
      <div
        ref={chatContainerRef}
        className="flex flex-col space-y-4 overflow-y-auto mb-4 pb-16"
      >
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

        {/* 로딩 중일 때 '입력 중...' 표시 */}
        {isLoading && (
          <div className="p-2 rounded-lg bg-purple-600 self-start">
            입력 중...
          </div>
        )}
      </div>

      {/* 입력 필드 */}
      <div className="fixed bottom-4 left-0 right-0 px-4 z-50">
        <div className="flex items-center gap-2">
          {/* 상담 종료하기 버튼 */}
          <button
            onClick={handleEndChat}
            disabled={isLoading} // 로딩 중일 때 버튼 비활성화
            className={`p-2 rounded-lg ${
              isLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            상담 종료하기
          </button>

          {/* 메시지 입력 필드 */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 rounded-lg bg-gray-800 text-white"
          />

          {/* 전송 버튼 */}
          <button
            onClick={sendMessage}
            disabled={isLoading} // 로딩 중일 때 버튼 비활성화
            className={`p-2 rounded-lg ${
              isLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-fuchsia-500 hover:bg-fuchsia-600 text-white"
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

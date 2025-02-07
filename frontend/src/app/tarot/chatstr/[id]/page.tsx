"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import CardSelector from "@/app/chat_test/card-selector";
import Image from "next/image";
import { tarotCards } from "@/utils/tarotCards";

export default function ChatPage() {
  const router = useRouter();

  type MessageType = {
    sender: string;
    text?: string;  // ✅ 텍스트 메시지는 선택적(optional) 속성
    content?: JSX.Element;  // ✅ 이미지나 기타 JSX 요소를 허용
  };
  const [messages, setMessages] = useState<MessageType[]>([
    { sender: "bot", text: "안녕하세요! 무엇을 도와드릴까요?" },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  const [chatType, setChatType] = useState("none"); // 대화 타입 상태 추가
  const [showTarotButton, setShowTarotButton] = useState(false); // 버튼 표시 여부
  const [showCardSelector, setShowCardSelector] = useState(false); // 카드 선택창 표시

  const chatContainerRef = useRef<HTMLDivElement>(null); // 스크롤 컨트롤을 위한 Ref

  // const sessionId = "abc123"; // 예시 세션 ID (실제 세션 ID를 백엔드에서 받아와야 함)
  const sessionId = "lacu207"; // 테스트용 세션 id
  const userId = 123; // 예시 사용자 ID (실제 사용자 ID를 받아와야 함)

  const sendMessage = async (card?: string | React.MouseEvent) => {
    let message = "";
    let gotype = "none";
  
    if (typeof card === "string") {
      message = card;
      gotype = chatType;
    } else {
      if (!input.trim()) return;
      message = input;
      const userMessage = { sender: "user", text: message };
      setMessages((prev) => [...prev, userMessage]);
      setChatType("none"); // 타로 버튼을 클릭하지 않았다면 타입을 되돌리자
    }
  
    setInput("");
    setIsLoading(true);
    setShowTarotButton(false); // 인풋이 들어가면 타로 보기 버튼 비활성화
  
    try {
      // ✅ Streaming API 요청
      const queryParams = new URLSearchParams({
        session_id: sessionId,
        user_input: message,
        type: gotype,
      }).toString();
  
      const response = await fetch(`http://127.0.0.1:8000/chat/stream?${queryParams}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      // ✅ chatTag를 응답 헤더에서 가져옴
      const chatTag = response.headers.get("X-ChatTag") || "none";
      setChatType(chatTag);
  
      // ✅ 스트리밍 응답을 읽어올 Reader 생성
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      const botMessage = { sender: "bot", text: "" };
  
      if (!reader) throw new Error("Stream reader is not available");
  
      // ✅ 스트리밍 데이터를 읽어오면서 메시지를 업데이트
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        botMessage.text += decoder.decode(value, { stream: true });
  
        // ✅ 최신 메시지로 업데이트 (실시간으로 렌더링)
        setMessages((prev) => [...prev.slice(0, -1), botMessage]);
      }
  
      // ✅ 최종 메시지 업데이트 완료
      setMessages((prev) => [...prev.slice(0, -1), botMessage]);
  
      // 🔹 타로 추천이 있는 경우 버튼을 활성화
      if (chatTag === "tarot") {
        setShowTarotButton(true);
      } else {
        setShowTarotButton(false);
      }
  
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error occurred while fetching response." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  

  // 🔹 타로 점 보기 버튼 클릭 핸들러
  const handleShowCardSelector = () => {
    setShowTarotButton(false);
    setShowCardSelector(true);
  };

  // 🔹 카드 선택 핸들러
  const handleCardSelect = (cardId: string) => {
    setShowCardSelector(false); // 카드 선택 창 종료
    const selectedCard = tarotCards[cardId];
    setMessages((prev) => [...prev, { sender: "bot", text: `"${selectedCard}" 카드를 선택했어!` },
      {
        sender: "bot",
        content: (
          <Image
            src={`/basic/${cardId}.svg`}
            alt={`Selected tarot card ${selectedCard}`}
            width={96}
            height={134}
            className="mt-2 mx-auto"
          />
        ),
      },
    ]);
    // 뽑은 카드 이미지가 보이도록 수정
    
    sendMessage(selectedCard); // 뽑은 카드 정보를 담아 요청
  };

  // 상담 종료하기 버튼 클릭 핸들러
  const handleEndChat = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/chat/close`, {
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
            {msg.text && <p>{msg.text}</p>} {/* ✅ 텍스트 메시지 출력 */}
            {msg.content && msg.content} {/* ✅ 이미지 메시지 출력 */}
          </div>
        ))}

        {/* 로딩 중일 때 '입력 중...' 표시 */}
        {isLoading && (
          <div className="p-2 rounded-lg bg-purple-600 self-start">
            입력 중...
          </div>
        )}
      </div>

      {/* 🔹 타로 점 보기 버튼 */}
      {showTarotButton && (
        <div className="flex flex-col items-center my-4">
          <button
            onClick={handleShowCardSelector}
            className="p-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            타로 점 보러가기 🔮
          </button>
        </div>
      )}

      {/* 🔹 카드 선택 UI */}
      {showCardSelector && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <CardSelector onCardSelect={handleCardSelect} onClose={() => setShowCardSelector(false)} />
        </div>
      )}

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
            className="flex-grow p-2 rounded-lg bg-gray-800"
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

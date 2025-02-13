"use client";

import { useState, useRef, useEffect } from "react";
import { API_URLS } from "@/config/api";
import ChatInput from "@/components/ChatInput";
// import 추가
import Image from "next/image";
import CardSelector from "@/components/CardSelector";
import { tarotCards } from "@/utils/tarotCards";

export default function ChatWindow() {
  // 요청에 필요한 데이터 설정
  // ========== 임시 값 설정 ==========
  // 봇 아이디를 할당 받는 방식 설정 ( /[id] 형태면 좋을 듯 )
  const botId = 1;
  
  // ========== 추가 된 변수 ==========
  // 세션 및 사용자 정보 상태
  const [sessionId, setSessionId] = useState("");
  const [userId, setUserId] = useState("");
  // 대화 타입 (요청에 포함할 정보)
  const [chatType, setChatType] = useState("none");

  // 타로 버튼 및 카드 선택창 표시 상태
  const [showTarotButton, setShowTarotButton] = useState(false);
  const [showCardSelector, setShowCardSelector] = useState(false);
  // ========== 추가 된 변수 ==========


  // 메시지 타입에 선택 카드 이미지를 위한 optional content 필드 추가
  const [messages, setMessages] = useState<
    { text: string; isUser: boolean; content?: React.ReactNode }[]
  >([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);


  // ========== 추가 된 함수 ==========
  // 페이지 진입 시 localStorage에 저장된 세션 정보가 없으면 새 세션 생성
  useEffect(() => {
    const storedSessionId = localStorage.getItem("sessionId");
    const storedUserId = localStorage.getItem("userId");

    if (storedSessionId && storedUserId) {
      setSessionId(storedSessionId);
      setUserId(storedUserId);
      return;
    }

    const createSession = async () => {
      try {
        const response = await fetch(API_URLS.CHAT.ENTER, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ botId }),
          credentials: "include",
        });

        if (!response.ok) throw new Error("세션 생성 실패");

        const data = await response.json();
        setSessionId(data.sessionId);
        setUserId(data.userId);
        localStorage.setItem("sessionId", data.sessionId);
        localStorage.setItem("userId", data.userId);
      } catch (error) {
        console.error("세션 생성 에러:", error);
      }
    };

    createSession();
  }, [botId]);

  // chatType(=chatTag) 변경에 따라 타로 버튼 노출 여부 결정
  useEffect(() => {
    if (chatType === "tarot") {
      setShowTarotButton(true);
    } else {
      setShowTarotButton(false);
    }
  }, [chatType]);

  // 타로 버튼 클릭 시 카드 선택창 호출
  const handleShowCardSelector = () => {
    setShowTarotButton(false);
    setShowCardSelector(true);
  };

  // 카드 선택 후 처리 (선택한 카드 이름을 채팅에 반영)
  const handleCardSelect = (cardId: string) => {
    setShowCardSelector(false);
    const selectedCard = tarotCards[cardId];
    // 봇 메시지로 카드 선택 결과를 보여주고, 선택한 카드 이름을 전송
    // 카드 선택 결과 메시지: 텍스트와 함께 카드 이미지 표시
    setMessages((prev) => [
      ...prev,
      { 
        text: `"${selectedCard}" 카드를 선택했어!`, 
        isUser: false,
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
    // 선택한 카드 이름을 서버에 전송
    handleSendMessage(selectedCard);
  };
  // ========== 추가 된 함수 ==========

  // 사용자가 메시지를 전송하면 실행되는 로직 (스트리밍 응답을 실시간 반영)
  const handleSendMessage = async (message: string) => {
    if (message.trim() === "세션종료") {
      try {
        const response = await fetch(API_URLS.CHAT.CLOSE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionId,
            userId: userId,
          }),
          credentials: "include",
        });
        if (!response.ok) throw new Error("세션 종료 실패");
        localStorage.removeItem("sessionId");
        localStorage.removeItem("userId");
        setSessionId("");
        setUserId("");
        setMessages((prev) => [
          ...prev,
          { text: "세션이 종료되었습니다.", isUser: false },
        ]);
      } catch (error) {
        console.error("세션 종료 에러:", error);
        setMessages((prev) => [
          ...prev,
          { text: "세션 종료에 실패했습니다.", isUser: false },
        ]);
      }
      return;
    }

    // 사용자의 메시지를 채팅에 추가
    setMessages((prev) => [...prev, { text: message, isUser: true }]);
    // 봇 응답 자리로 "입력중...."를 먼저 보여줌
    setMessages((prev) => [...prev, { text: "입력중....", isUser: false }]);
    let botMessageText = "";

    try {
      // FastAPI 스트리밍 엔드포인트에 POST 요청 전송

      const response = await fetch(API_URLS.CHAT.STREAM, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          user_input: message,
          user_id: userId,
          bot_id: botId,
          type: showTarotButton ? "none" : chatType,
        }),
      });

      // 응답 헤더에서 ChatTag 값을 가져와 대화 타입 갱신
      const chatTag = response.headers.get("ChatTag") || "none";
      setChatType(chatTag);

      if (!response.body) throw new Error("Response body is null");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // 스트리밍 응답을 읽어오면서 받은 청크를 누적하고 메시지 업데이트
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        botMessageText += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { text: botMessageText, isUser: false };
          return updated;
        });
      }
    } catch (error) {
      console.error("Streaming response error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { text: "Error retrieving response", isUser: false };
        return updated;
      });
    }
  };

  // 새로운 메시지가 추가될 때마다 스크롤을 자동으로 맨 아래로 이동
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-purple-100">
      {/* 채팅 로그 영역 (독립 스크롤 컨테이너) */}
      <div
        ref={chatContainerRef}
        className="flex-1 px-6 py-4 space-y-4 overflow-auto"
        style={{ marginBottom: "4rem" }} // 입력창 높이만큼 여백 추가
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.isUser ? "justify-end" : "justify-start"} w-full`}
          >
            {msg.isUser ? (
              // 사용자 메시지 (오른쪽 정렬)
              <div className="px-4 py-2 rounded-l-lg rounded-br-lg max-w-xs bg-gray-800 text-white">
                {msg.text}
              </div>
            ) : (
              // 봇 메시지 (왼쪽 정렬)
              <div className="px-4 py-2 rounded-r-lg rounded-bl-lg max-w-xs bg-purple-400 text-gray leading-relaxed">
                {msg.text}
                {msg.content && <div className="mt-2">{msg.content}</div>}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* ============ 추가된 요소 ============ */}
      {/* 타로 점 보기 버튼 (chatType이 "tarot"일 때) */}
      {showTarotButton && (
        <div className="flex justify-center p-2">
          <button
            onClick={handleShowCardSelector}
            className="px-4 py-2 bg-yellow-500 text-white rounded"
          >
            타로 점 보기 🔮
          </button>
        </div>
      )}

      {/* 카드 선택 UI (CardSelector 컴포넌트) */}
      {showCardSelector && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <CardSelector onCardSelect={handleCardSelect} onClose={() => setShowCardSelector(false)} />
        </div>
      )}
      {/* ============ 추가된 요소 ============ */}

      {/* 하단 입력창 */}
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
}

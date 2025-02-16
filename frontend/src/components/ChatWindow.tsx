"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { API_URLS } from "@/config/api";
import ChatInput from "@/components/ChatInput";
// import 추가
import Image from "next/image";
import CardSelector from "@/components/CardSelector";
import { tarotCards } from "@/utils/tarotCards";

interface ChatWindowProps {
  sessionIdParam?: string;
}

interface MessageForm {
  message: string;
  role: string;
  content?: React.ReactNode;
}

export default function ChatWindow({ sessionIdParam }: ChatWindowProps) {
  // 요청에 필요한 데이터 설정
  // ========== 임시 값 설정 ==========
  const botId = localStorage.getItem("botId");
  const [newSession, setNewSession] = useState(true);
  // ========== 추가 된 변수 시작==========
  // 세션 정보 상태
  const [sessionId, setSessionId] = useState(sessionIdParam || "");
  const userId = localStorage.getItem("userId");
  // 대화 타입 (요청에 포함할 정보)
  const [chatType, setChatType] = useState("none");

  // 타로 버튼 및 카드 선택창 표시 상태
  const [showTarotButton, setShowTarotButton] = useState(false);
  const [showCardSelector, setShowCardSelector] = useState(false);
  
  // 모바일 크기 확인하기 위한 변수
  const [isMobile, setIsMobile] = useState(false);
  // ========== 추가 된 변수 끝 ==========


// 특정 크기 이하로 내려갈 경우에 대한 상태를 반영하는 함수
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 메시지 타입에 선택 카드 이미지를 위한 optional content 필드 추가
  const [messages, setMessages] = useState<
    { text: string; isUser: boolean; content?: React.ReactNode }[]
  >([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // ========== 추가 된 함수 시작 =========
  // 페이지 진입 시 저장된 세션 정보가 없으면 새 세션 생성
  useEffect(() => {
    // 세션 진입 시 이전 대화 기록을 불러오는 함수
    const loadSessionMessages = async () => {
      try {
        // ==========================================
        // 이 위치에서 본인의 세션이 맞는 지 확인하는 isMySession 로직을 수행해야함!!!

        // ==========================================
        console.log("지금 메시지 로드");
        const response = await fetch(API_URLS.CHAT.LOAD_SESSION, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
          credentials: "include",
        });

        if (!response.ok) throw new Error("이전 대화 기록 불러오기 실패");

        const data = await response.json();

        // 서버에서 가져온 이전 대화 기록을 메시지 상태에 설정
        setMessages(data.map((msg: MessageForm) => ({
          text: msg.message,
          isUser: msg.role === "user",
          content: msg.content ? (
            <Image
              src={`/basic/${msg.content}.svg`}
              alt={`Selected tarot card ${msg.message}`}
              width={96}
              height={134}
              className="mt-2 mx-auto"
            />
          ) : undefined,
        })));
      } catch (error) {
        console.error("이전 대화 기록 불러오기 에러:", error);
      }
    };

    if (sessionId && !newSession) {
      loadSessionMessages(); // 세션 진입 시 이전 대화 기록을 불러오는 함수 호출
      return;
    }
  }, [botId, sessionId, newSession]);

  // chatType(=chatTag) 변경에 따라 타로 버튼 노출 여부 결정
  useEffect(() => {
    setShowTarotButton(chatType === "tarot");
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
  // ========== 추가 된 함수 끝 ==========

  // 사용자가 메시지를 전송하면 실행되는 로직 (스트리밍 응답을 실시간 반영)
  const handleSendMessage = useCallback(async (message: string) => {
    // "세션종료" 입력 시 세션 종료 트리거 발동 (임시)
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
        setSessionId("");
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
    // 세션 종료 트리거 끝 (임시 코드이므로 나중에 버튼을 만들거나 트리거를 기획할 것)

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
  }, [sessionId, userId, botId, chatType, showTarotButton]);

  // 페이지 진입 시 firstMessage가 있으면 바로 세팅하고 응답 생성
  useEffect(() => {
    const storedMessage = localStorage.getItem("firstMessage");
    if (storedMessage) {
      setNewSession(true);
      handleSendMessage(storedMessage).then(() => {
        setNewSession(false); // 첫 메시지 전송 후 세션 데이터 로드
        console.log("지금 첫 메시지 제어");
        localStorage.removeItem("firstMessage"); // ✅ 사용 후 삭제
      });
    } else {
      setNewSession(false);
    }
  }, []);

  // 새로운 메시지가 추가될 때마다 스크롤을 자동으로 맨 아래로 이동
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    // 모바일일때와 아닐때 배경 분기
    <div className={isMobile ? "relative h-screen" : "flex flex-col h-screen bg-purple-100"}>
      {isMobile && (
        <div className="absolute inset-0">
          {/* 이미지 임시, 경로 수정 필요 */}
          <Image
            src="/images/dummy1.png"
            alt="배경 이미지"
            fill
            className="object-cover"
          />
        </div>
      )}
      <div
        className={
          isMobile
            ? "relative z-10 flex flex-col h-screen bg-[rgba(70,35,10,0.3)]"
            : "flex flex-col h-screen"
        }
      >
        {/* 채팅 로그 영역 (독립 스크롤 컨테이너) */}
        <div
          ref={chatContainerRef}
          className="flex-1 px-6 py-4 space-y-4 overflow-auto"
          style={{ marginBottom: "4rem" }} // 입력창 높이만큼 여백 추가
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.isUser ? "justify-end" : "justify-start"
              } w-full`}
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
            <CardSelector
              onCardSelect={handleCardSelect}
              onClose={() => setShowCardSelector(false)}
            />
          </div>
        )}
        {/* ============ 추가된 요소 ============ */}
  
        {/* 하단 입력창 */}
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}
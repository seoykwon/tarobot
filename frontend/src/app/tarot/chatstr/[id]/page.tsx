"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import CardSelector from "@/app/chat_test/card-selector";
import Image from "next/image";
import { tarotCards } from "@/utils/tarotCards";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const router = useRouter();
  const { id } = useParams();
  const botId = id;

  interface ChatSession {
    sessionId: string;
    userId: string;
  }

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

  const [userId, setUserId] = useState(""); // 유저 아이디
  const [sessionId, setSessionId] = useState(""); // 세션 아이디 설정

  const chatContainerRef = useRef<HTMLDivElement>(null); // 스크롤 컨트롤을 위한 Ref

    // 페이지 입장 시 세션 생성 요청 (스프링 서버에서 세션 생성 후 sessionId, userId 반환)
    useEffect(() => {
      const storedSessionId = localStorage.getItem("sessionId");
      const storedUserId = localStorage.getItem("userId");
  
      if (storedSessionId && storedUserId) {
        setSessionId(storedSessionId);
        setUserId(storedUserId);
        return; // 기존 세션이 있으면 API 호출하지 않음
      }
  
      const createSession = async () => {
        try {
          const response = await fetch("http://localhost:8080/api/v1/chat/session/enter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ botId }),
            credentials: "include",
          });
  
          if (!response.ok) throw new Error("세션 생성 실패");
  
          const data: ChatSession = await response.json(); // ✅ API 응답 타입 적용
  
          setSessionId(data.sessionId);
          setUserId(data.userId);
  
          // ✅ localStorage에 저장 (새로고침해도 유지됨)
          localStorage.setItem("sessionId", data.sessionId);
          localStorage.setItem("userId", data.userId);
        } catch (error) {
          console.error("세션 생성 에러:", error);
        }
      };
  
      createSession();
    }, [botId]); // ✅ botId가 변경될 때만 실행

  const sendMessage = async (card?: string | React.MouseEvent) => {
    let message = "";
    let gotype = "none";
  
    if (typeof card === "string") {
      message = card;
      gotype = chatType;
    } else {
      if (!input.trim()) return;
      message = input;
      setMessages((prev) => [...prev, { sender: "user", text: message }]);
      setChatType("none");
    }
  
    setInput("");
    setIsLoading(true);
    setShowTarotButton(false);
  
    try {
      // ✅ JSON Body로 요청 전송 (쿼리 파라미터 제거)
      const response = await fetch("http://127.0.0.1:8000/chat/stream", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            session_id: sessionId,
            user_input: message,
            user_id: userId,
            bot_id: botId,
            type: gotype
        }),
    });
  
      const chatTag = response.headers.get("ChatTag") || "none";
      setChatType(chatTag);
  
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      const botMessage = { sender: "bot", text: "" };
  
      if (!reader) throw new Error("Stream reader is not available");
  
      // ✅ 새로운 `bot` 메시지를 따로 추가
      setMessages((prev) => [...prev, botMessage]);
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        const chunk = decoder.decode(value, { stream: true });
  
        if (chunk.includes("[END]")) break;
  
        setMessages((prev) => {
          const updatedMessages = [...prev];
  
          // ✅ 최신 `bot` 메시지를 찾기 위해 `findLastIndex()` 사용
        const lastBotIndex = updatedMessages.length - 1; 

        if (updatedMessages[lastBotIndex].sender === "bot") {
          updatedMessages[lastBotIndex].text += chunk;  // ✅ 가장 최근 봇 메시지만 업데이트
        }
  
          return updatedMessages;
        });
      }
  
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Error occurred while fetching response." }]);
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
  
  // // 상담 종료하기 버튼 클릭 핸들러 -> FastAPI 직접 연결 버전
  // const handleEndChat = async () => {
  //   try {
  //     const response = await fetch(`http://127.0.0.1:8000/chat/close`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ sessionId }), // 세션 ID 전송
  //     });
      
  //     if (!response.ok) {
  //       throw new Error("Failed to close chat session");
  //     }
      
  //     const data = await response.json();
  //     console.log(data.message); // 성공 메시지 출력
      
  //     // ✅ localStorage에서 삭제
  //     localStorage.removeItem("sessionId");
  //     localStorage.removeItem("userId");
      
  //     setSessionId("");
  //     setUserId("");
      
  //     // 상담 종료 후 처리 (예: 홈 화면으로 이동)
  //     alert("디버그:: 상담이 종료되었습니다.");
  //     router.push("/home"); // 홈 페이지로 리다이렉트
  //   } catch (error) {
  //     console.error("Error closing chat session:", error);
  //     alert("상담 종료 중 오류가 발생했습니다.");
  //   }
  // };

  // 채팅 종료 버튼 Spring 연결 핸들러
  const handleEndChat = async () => {
    try {
      // 스프링 서버로 종료 요청 (응답은 기다리지 않거나 간단한 성공/실패만 확인)
      fetch("http://localhost:8080/api/v1/chat/session/close", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, sessionId }),
        credentials: "include",
      });

      // ✅ localStorage에서 삭제
      localStorage.removeItem("sessionId");
      localStorage.removeItem("userId");
      
      setSessionId("");
      setUserId("");

      // 클라이언트에서는 별도의 응답 처리가 필요없도록 처리
      alert("채팅 종료 요청을 보냈습니다.");
      router.push("/home");
    } catch (error) {
      console.error("채팅 종료 요청 에러:", error);
    }
  };

  
  // // ✅ 페이지 떠날 때 세션 자동 종료
  // useEffect(() => {
  //   const handleBeforeUnload = () => {
  //     handleEndChat();
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, [sessionId]);

  // 새로운 메시지가 추가될 때 자동으로 스크롤 하단으로 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    console.log("chatType 변경 감지:", chatType); // ✅ 디버깅 로그 추가
  
    if (chatType === "tarot") {
      setShowTarotButton(true);
    } else {
      setShowTarotButton(false);
    }
  }, [chatType]);  

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

"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import ReviewComponent from "./review-component"
import CardSelector from "./card-selector"
import { toast } from "sonner"
import SummaryComponent from "./summary-component"
import { API_URLS } from "@/config/api"

type MessageType = {
  sender: "bot" | "user"
  text: string
  options?: string[]
  isCardSelection?: boolean
  cardImage?: string
}

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<MessageType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [showCardSelector, setShowCardSelector] = useState(false)
  const [showReviewOverlay, setShowReviewOverlay] = useState(false)
  const [showSummaryOverlay, setShowSummaryOverlay] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { id: tarobotId } = useParams(); // tarobotId 동적 라우팅 값 가져오기
  const [sessionId, setSessionId] = useState<string | null>(null); // 세션 ID 상태
  const [userId, setUserId] = useState<string | null>(null); // 사용자 ID 상태


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
        const response = await fetch(API_URLS.CHAT.GET_SESSION, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tarobotId }),
          credentials: "include",
        });
    
        if (!response.ok) throw new Error("세션 생성 실패");
    
        const data = await response.json(); // ✅ API 응답 타입 적용
    
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
  }, [tarobotId]); // ✅ botId가 변경될 때만 실행


  useEffect(() => {
    if (!tarobotId) {
      console.error("타로봇 ID가 없습니다.");
      router.push("/home"); // 타로봇 ID가 없으면 홈으로 리다이렉트
      return;
    }
  
    if (messages.length === 0) { // 메시지가 없는 경우에만 초기화
      startChat();
    }
  }, [tarobotId, messages.length, router]); // tarobotId 또는 messages.length 변경 시에만 실행
  
  const startChat = async () => {
    setIsLoading(true);
    try {
      const initialMessage: MessageType = {
        sender: "bot",
        text: "안녕하세요! 아래 보기 중 원하시는 상담을 선택해주세요.",
        options: ["연애운", "취업운", "금전운"],
      };
      setMessages([initialMessage]);
    } catch (error) {
      console.error("Error starting chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 옵션 선택 처리
  const handleOptionSelect = async (option: string) => {
    setIsLoading(true)
    const userMessage: MessageType = {
      sender: "user",
      text: `${option}을 선택했습니다.`,
    }
    setMessages((prev) => [...prev, userMessage])
    try {
      const response = await fetch(API_URLS.CHAT.STREAM(sessionId as string, option), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      )
      if (!response.body) throw new Error("ReadableStream not supported")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      let botMessageText = ""

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone
        botMessageText += decoder.decode(value)
        setMessages((prev) => {
          const updatedMessages = [...prev]
          const lastMessage = updatedMessages[updatedMessages.length - 1]
          if (lastMessage && lastMessage.sender === "bot") {
            lastMessage.text = botMessageText
          } else {
            updatedMessages.push({ sender: "bot", text: botMessageText })
          }
          return updatedMessages
        })
      }
      // 스트림 완료 후 카드 선택 안내 메시지 추가
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "카드를 선택해주세요.", isCardSelection: true },
      ])
      setCurrentStep(2)
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "오류가 발생했습니다. 다시 시도해주세요." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // 카드 선택 처리
  // onCardSelect으로 전달된 카드 id는 string 타입 (예:"maj5", "cups3", "wands10" 등)을 받습니다.
  const handleCardSelect = async (cardId: string) => {
    setShowCardSelector(false)
    setIsLoading(true)
    // 카드 선택 시, 사용자 메시지에는 카드 앞면 이미지를 보여줌
    const userMessage: MessageType = {
      sender: "user",
      text: `카드 ${cardId}를 선택했습니다.`,
      cardImage: `/basic/${cardId}.svg`,
    }
    setMessages((prev) => [...prev, userMessage])
    try {
      const response = await fetch(API_URLS.CHAT.STREAM(sessionId as string, cardId), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      )
      if (!response.body) throw new Error("ReadableStream not supported")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      let botMessageText = ""
      // 초기 bot 메시지 추가 (빈 텍스트로 시작)
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "", cardImage: undefined },
      ])
      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone
        botMessageText += decoder.decode(value)
        setMessages((prev) => {
          const updatedMessages = [...prev]
          const lastMessage = updatedMessages[updatedMessages.length - 1]
          if (lastMessage && lastMessage.sender === "bot") {
            lastMessage.text = botMessageText
          }
          return updatedMessages
        })
      }
      setCurrentStep(3)
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "오류가 발생했습니다. 다시 시도해주세요." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // 리뷰 제출 처리 예시
  const handleReviewSubmit = async (data: { rating: number; content: string }) => {
    try {
      console.log(data)
      await fetch(API_URLS.REVIEW.CREATE(tarobotId as string), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      toast.success("리뷰가 성공적으로 제출되었습니다.")
      setShowReviewOverlay(false)
    } catch {
      toast.error("리뷰 제출에 실패했습니다. 다시 시도해주세요.")
    }
  }

  // 요약 데이터를 찾는 함수
  const getSummaryData = () => {
    let cardImage = ""
    let content = ""
    for (const msg of messages) {
      if (msg.cardImage) {
        cardImage = msg.cardImage
      }
      if (msg.sender === "bot" && !msg.isCardSelection && msg.text.length > 0) {
        content = msg.text
      }
    }
    return { cardImage, content }
  }

  // 종료 버튼 클릭 시 대화 내용을 백엔드로 전송 후 홈으로 이동
  const handleExit = async () => {
    try {
      const response = await fetch(API_URLS.CHAT.CLOSE, {
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
      router.push("/home"); // 홈 페이지로 리다이렉트
    }
  }

  // 스크롤 자동 이동 처리
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="min-h-screen bg-gray-900 p-4 pb-24 flex flex-col">
      {/* 채팅창과 종료 버튼을 감싸는 컨테이너에 relative 추가 */}
      <div className="relative flex-1">
        {/* relative 기준에서 absolute로 위치를 조정 */}
        <div className="absolute top-3 right-3 z-50">
          <button
            onClick={handleExit}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            종료하기
          </button>
        </div>
        <div ref={chatContainerRef} className="flex flex-col space-y-4 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div key={index} className="flex flex-col">
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.sender === "user"
                    ? "bg-purple-600 self-end rounded-tr-none"
                    : "bg-gray-700 self-start rounded-tl-none"
                }`}
              >
                <p className="text-white">{msg.text}</p>
                {msg.cardImage && (
                  <Image
                    src={msg.cardImage}
                    alt="Selected tarot card"
                    width={192}
                    height={268}
                    className="mt-2"
                  />
                )}
              </div>
              {currentStep === 1 && msg.options && (
                <div className="flex gap-2 mt-2">
                  {msg.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect(option)}
                      disabled={isLoading}
                      className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-6 py-2 rounded-lg"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
              {currentStep === 2 && msg.isCardSelection && (
                <button
                  onClick={() => setShowCardSelector(true)}
                  disabled={isLoading}
                  className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-6 py-2 rounded-lg mt-2 self-start"
                >
                  카드 선택하기
                </button>
              )}
            </div>
          ))}
          {currentStep === 3 && (
            <div className="flex flex-col items-center space-y-4 mt-4">
              <p className="text-white">타로 점의 결과에 만족하시나요?</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                다시하기
              </button>
              <button
                onClick={() => setShowReviewOverlay(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
              >
                리뷰 작성하기
              </button>
              <button
                onClick={() => setShowSummaryOverlay(true)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg"
              >
                요약하기
              </button>
              <button
                onClick={handleExit}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
              >
                종료하기
              </button>
            </div>
          )}
          {isLoading && (
            <div className="bg-gray-700 self-start p-4 rounded-2xl rounded-tl-none">
              <p className="text-white">입력 중...</p>
            </div>
          )}
        </div>
      </div>
      {showCardSelector && (
        <CardSelector
          onCardSelect={handleCardSelect}
          onClose={() => setShowCardSelector(false)}
        />
      )}
      {showReviewOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <ReviewComponent onSubmit={handleReviewSubmit} />
            <button
              onClick={() => setShowReviewOverlay(false)}
              className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              닫기
            </button>
          </div>
        </div>
      )}
      {showSummaryOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <SummaryComponent {...getSummaryData()} onClose={() => setShowSummaryOverlay(false)} />
        </div>
      )}
    </div>
  );
}  

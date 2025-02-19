// chatstandby.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URLS } from "@/config/api";
import ChatInputNoVoice from "@/components/Chat/Input/ChatInputNoVoice";
import { useSession } from "@/context/SessionContext";
import { getTarotMaster } from "@/libs/api";
import Image from "next/image";

interface TarotMaster {
  id: number;
  name: string;
  description: string;
  concept: string;
  profileImage: string;
  mbti: string;
}

export default function ChatStandby() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ text: string; isUser: string; content?: React.ReactNode }[]>([
    { text: "안녕하세요~", isUser: "assistant" },
  ]);
  // const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const { triggerSessionUpdate } = useSession(); // ✅ 세션 업데이트 트리거 가져오기
  
  const botId = localStorage.getItem("botId");

  // 추가된 요소 =======================
  const userId = localStorage.getItem("userId");
  const [tarotMaster, setTarotMaster] = useState<TarotMaster>();

  // botId로 부터 정보 불러오기 (프사 등)
  useEffect(() => {
    if (!botId) return;
      const fetchTarotMasters = async () => {
        try {
          const master = await getTarotMaster(botId);
          setTarotMaster(master);
        } catch (error) {
          console.error("타로 마스터 불러오기 실패:", error);
        }
      };
  
      fetchTarotMasters();
    }, [botId]);

  // 추가된 요소 끝 ======================

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFirstMessage = async (message: string) => {
    try {
      const title = message;
      const response = await fetch(API_URLS.CHAT.ENTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botId, title }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("세션 생성 실패");

      const data = await response.json();
      localStorage.setItem("firstMessage", message);

      // 세션 생성 후 전역 업데이트 트리거 실행
      triggerSessionUpdate();

      // 새로운 채팅 세션 페이지로 이동합니다.
      router.push(`/chat/${data.sessionId}`);
    } catch (error) {
      console.error("세션 생성 에러:", error);
    }
  };

  return (
    <div className={isMobile ? "relative h-screen bg-purple-50" : "flex flex-col h-screen bg-purple-50 rounded-lg"}>
      <div className={`${isMobile ? "relative z-10 flex flex-col h-screen" : "flex flex-col h-screen"}`}
      style={isMobile ? { height: "calc(100vh - 3.5rem)" } : {}}>
        <div className="flex-1 px-6 py-4 space-y-4 overflow-auto mb-4 sm:mb-14">
          {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.isUser === "assistant" ? "justify-start" : "justify-end"
            } w-full`}
          >
            {msg.isUser === "assistant" ? (
              <div className="flex items-start space-x-3">
                {/* 봇 프로필 이미지 */}
                {/* 현재 botid에 대해 fetch 해서 엔티티 가져온 뒤 profileImage 속성값을 src로 하는게 좋음 */}
                <Image
                  src={tarotMaster?.profileImage || `/bots/${botId}_profile.png`}
                  alt="Bot Profile"
                  width={128}
                  height={128}
                  className="w-16 h-16 rounded-full"
                />
                {/* 봇 메시지 말풍선 */}
                <div className="px-4 py-2 rounded-lg max-w-[90%] text-gray-800 leading-relaxed">
                  {msg.text}
                  {msg.content && <div className="mt-2">{msg.content}</div>}
                </div>
              </div>
            ) : (
              /* 사용자 메시지 */
              <div
                className={`px-4 py-2 rounded-lg max-w-[60%] ${
                  msg.isUser === userId ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                }`}
              >
                {msg.text}
              </div>
            )}
          </div>
        ))}
        </div>
        <ChatInputNoVoice
          onSend={(message) => {
            setMessages([...messages, { text: message, isUser: userId! }]);
            handleFirstMessage(message);
          }}
        />
      </div>
    </div>
  );
  
}

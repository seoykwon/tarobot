// components/ChatWindowWs.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { API_URLS } from "@/config/api";
import ChatInput from "@/components/ChatInput";
import Image from "next/image";
import CardSelector from "@/components/CardSelector";
import { tarotCards } from "@/utils/tarotCards";
import { io, Socket } from "socket.io-client";
import { useSession } from "@/context/SessionContext";
import { getTarotMaster } from "@/libs/api";

interface ChatWindowProps {
  sessionIdParam?: string;
}

interface MessageForm {
  message: string;
  role: string;
  content?: React.ReactNode;
}

interface TarotMaster {
  id: number;
  name: string;
  description: string;
  concept: string;
  profileImage: string;
  mbti: string;
}

export default function ChatWindowWs({ sessionIdParam }: ChatWindowProps) {
  const botId = localStorage.getItem("botId");
  const userId = localStorage.getItem("userId");
  const sessionId = sessionIdParam || "nosession";
  const [tarotMaster, setTarotMaster] = useState<TarotMaster>();
  const [chatType, setChatType] = useState("none");
  const [showTarotButton, setShowTarotButton] = useState(false);
  const [showCardSelector, setShowCardSelector] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: string; content?: React.ReactNode }[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const [nickname, setNickname] = useState("");
  
  const [isRoomJoined, setIsRoomJoined] = useState(false);
  const pendingMessageRef = useRef<string | null>(null); // ✅ useRef로 변경

  const { triggerSessionUpdate } = useSession();

  // 프로필에서 닉네임 불러오기 함수
  const fetchProfileData = useCallback(async (): Promise<void> => {
    // 내 프로필 정보 불러오기
    try {
      const res = await fetch(API_URLS.USER.ME, {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setNickname(data.nickname || "");
      } else {
        console.error("프로필 데이터를 불러오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("프로필 데이터 요청 중 오류 발생:", error);
    } finally {
    }
  }, []);

  // 컴포넌트 마운트 시 프로필 데이터 불러오기
  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

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
  
  // 사용자가 메시지를 전송하면 실행되는 로직 (스트리밍 응답을 실시간 반영)
  const handleSendMessage = useCallback(async (message: string) => {
    // 세션 업데이트 함수
    const updateChatSession = async () => {
      try {
        const response = await fetch(API_URLS.CHAT.UPDATE(sessionId), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
          // PUT 요청이 body를 필요로 할 경우 body: JSON.stringify({ ... }) 추가
        });
  
        if (!response.ok) {
          throw new Error('채팅 세션 업데이트 실패');
        }
  
      } catch (err) {
        console.error('업데이트 에러:', err);
      }
    };

    // ✅ 방 입장이 완료되지 않았다면 메시지를 대기열에 추가
    if (!isRoomJoined) {
      console.warn("⚠️ 방 입장이 완료되지 않아 메시지를 대기열에 추가합니다.");
      pendingMessageRef.current = message; // ✅ useRef에 저장
      return;
    }

    if (!socketRef.current) return;

    updateChatSession().then(() => {
      triggerSessionUpdate();
    }); // 세션 업데이트
  
    // ✅ Socket.IO를 통해 메시지 전송
    socketRef.current.emit("chat_message", {
      room_id: sessionId,
      user_id: userId,
      bot_id: botId,
      user_input: message,
      type: showTarotButton ? "none" : chatType,
    });
  
    setChatType("none"); // 보내고 난 뒤 초기화

  }, [sessionId, chatType, showTarotButton, botId, userId, isRoomJoined, triggerSessionUpdate]);

  // WebSocket 연결
  useEffect(() => {
    // 모든 값이 준비되지 않으면 연결하지 않음
    if (!sessionId || !userId || !nickname) return;
    // 이미 연결된 경우 재연결 방지
    if (socketRef.current) return;
  
    // ✅ Socket.IO 연결
    const socket = io(`${API_URLS.SOCKET.BASE}`, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
    });
  
    socketRef.current = socket;
  
    // ✅ 세션(Room) 참가
    socket.emit("join_room", { room_id: sessionId, user_id: userId, nickname });
  
    socket.on("room_joined", (data) => {
      console.log(`Room joined: ${data.room_id}`);
      setIsRoomJoined(true); // 방 입장 완료 상태 변경
    });
  
    // ✅ 메시지 수신 처리
    socket.on("chat_message", (data) => {
      console.log(`📩 사용자 메시지 수신: ${data}`);
      setMessages((prev) => [...prev, { text: data.message, isUser: data.role }]);
      // setMessages((prev) => [...prev, { text: "입력 중...", isUser: "assistant" }]);
    });
  
    // socket.on("chatbot_message", (data) => {
    //   console.log(`🤖 챗봇 메시지 수신: ${data}`);
    //   setChatType(data.chat_tag);
    //   setMessages((prev) => {
    //     const updatedMessages = [...prev];
    //     const lastBotIndex = updatedMessages.findLastIndex(
    //       (msg) => msg.isUser === "assistant" && msg.text === "입력 중..."
    //     );
    //     if (lastBotIndex !== -1) {
    //       updatedMessages.splice(lastBotIndex, 1);
    //     }
    //     updatedMessages.push({ text: data.message, isUser: "assistant" });
    //     return updatedMessages;
    //   });
    // });
    socket.on("chatbot_message", (data) => {
      console.log(`🤖 챗봇 메시지 수신: ${data}`);
      setChatType(data.chat_tag);
      setMessages((prev) => {
        const updatedMessages = [...prev];
        // 마지막 메시지가 assistant의 메시지라면, 그 메시지에 새로운 청크를 추가합니다.
        if (
          updatedMessages.length > 0 &&
          updatedMessages[updatedMessages.length - 1].isUser === "assistant"
        ) {
          updatedMessages[updatedMessages.length - 1].text += data.message;
        } else {
          // 처음 받은 메시지라면 새로운 메시지 객체를 추가합니다.
          updatedMessages.push({ text: data.message, isUser: "assistant" });
        }
        return updatedMessages;
      });
    });
  
    return () => {
      console.log("소켓 연결 해제");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [sessionId, userId, nickname]);

  // pendingMessage를 감지해 전달
  useEffect(() => {
    if (isRoomJoined && pendingMessageRef.current) {
      console.log("🔄 `isRoomJoined` 변경 감지, 대기 중이던 메시지 전송:", pendingMessageRef.current);
      handleSendMessage(pendingMessageRef.current);
      pendingMessageRef.current = null;
    }
  }, [isRoomJoined, handleSendMessage]);

// 특정 크기 이하로 내려갈 경우에 대한 상태를 반영하는 함수
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 세션 진입 시 이전 대화 기록을 불러오는 함수
  useEffect(() => {
    const storedMessage = localStorage.getItem("firstMessage");
    if (storedMessage) return;
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
          isUser: msg.role,
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

    if (sessionId) {
      loadSessionMessages(); // 세션 진입 시 이전 대화 기록을 불러오는 함수 호출
      return;
    }
  }, [botId, sessionId]);

  // chatType(=chatTag) 변경에 따라 기능 처리리결정
  useEffect(() => {
    setShowTarotButton(chatType === "tarot");

    if (chatType === "tarot result") {
      const closeSession = async () => {
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
        } catch (error) {
          console.error("세션 종료 에러:", error);
        }
      };
  
      closeSession();
    }
  }, [chatType, sessionId, userId]);

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
        isUser: "assistant",
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

  // 페이지 진입 시 firstMessage가 있으면 바로 세팅하고 응답 생성
  useEffect(() => {
    const storedMessage = localStorage.getItem("firstMessage");
    if (storedMessage) {
      // ✅ 200ms 뒤에 첫 메시지 전송 (WebSocket 연결 보장)
      setTimeout(() => {
        handleSendMessage(storedMessage).then(() => {
          console.log("지금 첫 메시지 제어");
          localStorage.removeItem("firstMessage"); // ✅ 사용 후 삭제
        });
      }, 200); // 🚀 WebSocket 안정성을 위해 200ms 대기
    } else {
      // console.log("기존 세션 입장");
    }
  }, [handleSendMessage]);

  // 새로운 메시지가 추가될 때마다 스크롤을 자동으로 맨 아래로 이동
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
        // 모바일일때와 아닐때 배경 분기
        <div className={isMobile ? "relative h-screen bg-purple-50" : "flex flex-col h-screen bg-purple-50 rounded-lg"}>
        {/* 모바일일 때 이미지 부분 삭제 */}
        <div
        className={
        isMobile
        ? "relative z-10 flex flex-col h-screen bg-purple-50"
        : "flex flex-col h-screen"
        }
        style={isMobile ? { height: "calc(100vh - 3.5rem)" } : {}}
        >
        {/* 채팅 로그 영역 (독립 스크롤 컨테이너) */}
        <div
          ref={chatContainerRef}
          className="flex-1 px-6 py-4 space-y-4 overflow-auto mb-4 sm:mb-14"
        >
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
                  {index === messages.length - 1 && chatType === "tarot" && (
                    <div className="mt-2">
                      <button
                        onClick={handleShowCardSelector}
                        className="px-4 py-2 bg-yellow-500 text-white rounded"
                      >
                        타로 점 보기 🔮
                      </button>
                    </div>
                  )}
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
  
        {/* ============ 추가된 요소 ============ */}
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
        <ChatInput onSend={handleSendMessage} sessionId={sessionId}/>
      </div>
    </div>
  );
}
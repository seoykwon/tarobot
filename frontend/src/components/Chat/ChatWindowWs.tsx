// components/ChatWindowWs.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { API_URLS } from "@/config/api";
import ChatInput from "@/components/Chat/Input/ChatInput";
import Image from "next/image";
import CardSelector from "@/components/CardSelector";
import { tarotCards } from "@/utils/tarotCards";
import { io, Socket } from "socket.io-client";
import { useSession } from "@/context/SessionContext";
import { getTarotMaster } from "@/libs/api";
import { createPortal } from "react-dom";

// TypingIndicator
function TypingIndicator({ nickname }: { nickname: string }) {
  return (
    <div className="flex items-center px-4 py-2">
      <span className="mr-2 font-semibold text-gray-700">{nickname}</span>
      <div className="flex space-x-1">
        <span className="w-2 h-2 bg-gray-600 rounded-full animate-dotWave" style={{ animationDelay: "0s" }}></span>
        <span className="w-2 h-2 bg-gray-600 rounded-full animate-dotWave" style={{ animationDelay: "0.2s" }}></span>
        <span className="w-2 h-2 bg-gray-600 rounded-full animate-dotWave" style={{ animationDelay: "0.4s" }}></span>
      </div>
      <span className="ml-2 text-gray-600">입력중입니다...</span>
    </div>
  );
}

interface ChatWindowProps {
  sessionIdParam: string;
}

interface MessageForm {
  message: string;
  role: string;
  content?: React.ReactNode;
  response_id?: string;
  sequence?: number;

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
  // localStorage에서 botId, userId 가져오기
  const botId = new URLSearchParams(window.location.search).get("botId") || localStorage.getItem("botId") || "";  // 쿼리 파라미터 or localstorage or 없음
  const storedUserId = localStorage.getItem("userId") || "";
  
  // sessionIdParam이 없으면 "nosession"
  const sessionId = sessionIdParam|| "nosession";

  const [tarotMaster, setTarotMaster] = useState<TarotMaster>();
  const [chatType, setChatType] = useState("none");
  const [showTarotButton, setShowTarotButton] = useState(false);
  const [showCardSelector, setShowCardSelector] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<MessageForm[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // ✅ Socket.IO 객체를 저장
  const socketRef = useRef<Socket | null>(null);
  const hasClosedSessionRef = useRef(false);

  // ✅ 프로필 닉네임
  const [nickname, setNickname] = useState("");
  const [saying, setSaying] = useState(false);
  const [isRoomJoined, setIsRoomJoined] = useState(false);

  // ✅ 대기 중인 메시지
  const pendingMessageRef = useRef<string | null>(null);

  // ✅ lastInput를 useRef로 (10초 idle 매크로용)
  const lastInputRef = useRef("");
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ SessionContext
  const { triggerSessionUpdate } = useSession();

  // 1. 타이핑 중인 사용자를 관리하는 상태 추가
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // 무응답 타이머를 위한 변수
  const sessionIdRef = useRef(sessionId);
  const botIdRef = useRef(botId);
  const isRoomJoinedRef = useRef(isRoomJoined);

  // =========================================
  // 프로필에서 닉네임 불러오기 함수
  // =========================================
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

  // useEffect로 최신 값 유지
  useEffect(() => {
    sessionIdRef.current = sessionId;
    botIdRef.current = botId;
    isRoomJoinedRef.current = isRoomJoined;
  }, [sessionId, botId, isRoomJoined]);

  // =========================================
  // botId로 부터 정보 불러오기 (프사 등)
  // =========================================
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

  
  // =========================================
  // 사용자가 메시지를 전송하면 실행되는 로직 (스트리밍 응답을 실시간 반영)
  // =========================================
  const handleSendMessage = useCallback(async (message: string) => {
    // 세션 업데이트 함수
    const updateChatSession = async () => {
      try {
        const response = await fetch(API_URLS.CHAT.UPDATE(sessionId), {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error("채팅 세션 업데이트 실패");
        }
      } catch (err) {
        console.error("업데이트 에러:", err);
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
      user_id: storedUserId,  // ✅ localStorage에서 가져온 userId
      bot_id: botId,
      user_input: message,
      type: showTarotButton ? "none" : chatType,
    });

    setChatType("none"); // 보내고 난 뒤 초기화
  }, [sessionId, chatType, showTarotButton, botId, storedUserId, isRoomJoined, triggerSessionUpdate]);


  // =========================================
  // WebSocket 연결
  // =========================================
  useEffect(() => {
    // 모든 값이 준비되지 않으면 연결하지 않음
    // userId가 없거나 sessionIdParam이 "nosession"이면 방 생성 불가
    if (sessionId === "nosession" || !storedUserId || !nickname) {
      console.log("🚫 조건 불충족: sessionId=", sessionId, " userId=", storedUserId, " nickname=", nickname);
      return;
    }
    // 이미 연결된 경우 재연결 방지
    if (socketRef.current) {
      console.log("⚠️ 기존 소켓 연결이 존재함. 새 연결을 만들지 않음.");
      return;
    }

    // ✅ Socket.IO 연결
    const socket = io(`${API_URLS.SOCKET.BASE}`, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
    socketRef.current = socket;

    // ✅ 세션(Room) 참가
    socket.emit("join_room", {
      room_id: sessionId,
      user_id: storedUserId,
      nickname
    });

    socket.on("room_joined", (data) => {
      console.log(`Room joined: ${data.room_id}`);
      setIsRoomJoined(true); // 방 입장 완료 상태 변경
    });

    // ✅ 사용자 메시지 수신 처리
    socket.on("chat_message", (data) => {
      console.log(`📩 사용자 메시지 수신: ${data}`);
      setMessages((prev) => [...prev, { message: data.message, role: data.role }]);
    });

    // ✅ 챗봇 메시지 (스트리밍 청크) 수신 처리
    socket.on("chatbot_message", (data) => {
      console.log("🤖 챗봇 메시지 수신:", data);
      setSaying(false);

      setMessages((prev) => {
        const updatedMessages = [...prev];

        // 1) 이미 해당 response_id를 가진 봇 메시지가 있는지 뒤에서부터 검색
        const existingIndex = updatedMessages
          .slice()
          .reverse() // 뒤에서부터 확인
          .findIndex((msg) => msg.role === "assistant" && msg.response_id === data.response_id);

        const realIndex = existingIndex >= 0
          ? updatedMessages.length - 1 - existingIndex
          : -1;

        if (data.response_id && realIndex >= 0) {
          // 2) 이미 존재하는 메시지라면, 그 메시지 내용에 chunk 이어붙이기
          updatedMessages[realIndex].message += data.message;
        } else {
          // 3) 해당 response_id 메시지가 아직 없다면 새로 추가
          setChatType(data.chat_tag);
          if (data.chat_tag == "tarot result") hasClosedSessionRef.current = false;
          updatedMessages.push({
            message: data.message,
            role: data.role,
            response_id: data.response_id,
            sequence: data.sequence,
          });
        }
        return updatedMessages;
      });
    });

    // 응답 생성 중 표시
    socket.on("saying", () => {
      setSaying(true);
      console.log("입력중...");
    });
    
    // 상대방 타이핑 표시 (원하면 UI 반영)
    socket.on("typing_indicator", (data) => {
      console.log("[typing_indicator]:", data);
      // 예) "OOO님이 입력중" 표시
    });

    // **typing_indicator 이벤트 핸들러 (닉네임 사용)**
    socket.on("typing_indicator", (data) => {
      setTypingUsers((prev) => {
        if (data.typing) {
          // 현재 상태(prev)를 참조하여 nickname이 포함되어 있는지 확인
          if (data.nickname !== nickname && !prev.includes(data.nickname)) {
            return [...prev, data.nickname];
          }
          return prev;
        } else {
          return prev.filter((n) => n !== data.nickname);
        }
      });
    });

    return () => {
      console.log("소켓 연결 해제");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [sessionId, storedUserId, nickname]);

    // **타이핑 인디케이터 등장 시 자동 스크롤**
    useEffect(() => {
      if (typingUsers.length > 0 && chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, [typingUsers]);
  
  // ✅ pendingMessage를 감지해 전달
  useEffect(() => {
    if (isRoomJoined && pendingMessageRef.current) {
      const pendingMessage = pendingMessageRef.current; // pendingMessage는 string 타입으로 추론됨
      console.log("🔄 `isRoomJoined` 변경 감지, 대기 중이던 메시지 전송:", pendingMessage);
      (async () => {
        await handleSendMessage(pendingMessage);
        if (socketRef.current) {
          socketRef.current.emit("typing_stop", { room_id: sessionId });
        }
      })();
      pendingMessageRef.current = null;
    }
  }, [isRoomJoined, handleSendMessage]);


  // =========================================
  // 특정 크기 이하로 내려갈 경우에 대한 상태를 반영
  // =========================================
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // =========================================
  // 세션 진입 시 이전 대화 기록을 불러오는 함수
  // =========================================
  useEffect(() => {
    const storedMessage = localStorage.getItem("firstMessage");
    if (storedMessage) return; // firstMessage가 있으면 아래 로드 스킵

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
          message: msg.message,
          role: msg.role,
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

    // sessionId가 "nosession"이면 굳이 로드 안 함
    if (sessionId && sessionId !== "nosession") {
      loadSessionMessages();
    }
  }, [botId, sessionId]);


  // =========================================
  // chatType(=chatTag) 변경에 따라 기능 처리결정
  // =========================================
  useEffect(() => {
    setShowTarotButton(chatType === "tarot");

    if (chatType === "tarot result" && !hasClosedSessionRef.current) {
      hasClosedSessionRef.current = true;
      const closeSession = async () => {
        try {
          const response = await fetch(API_URLS.CHAT.CLOSE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: sessionId,
              userId: storedUserId,
              botId: botId,
            }),
            credentials: "include",
          });
          if (!response.ok) throw new Error("세션 종료 실패");
        } catch (error) {
          console.error("세션 종료 에러:", error);
        }
      };
      closeSession().then(() => {
        setTimeout(()=>setChatType("none"), 1000);
        triggerSessionUpdate();
      });
    }
  }, [chatType, sessionId, storedUserId, botId, triggerSessionUpdate]);


  // =========================================
  // 타로 버튼 클릭 시 카드 선택창 호출
  // =========================================
  const handleShowCardSelector = () => {
    setShowTarotButton(false);
    setShowCardSelector(true);
  };


  // =========================================
  // 카드 선택 후 처리 (선택한 카드 이름을 채팅에 반영)
  // =========================================
  const handleCardSelect = (cardId: string) => {
    if (!socketRef.current) return;
    const socket = socketRef.current; // 최초의 socket 저장
    setShowCardSelector(false);
    const selectedCard = tarotCards[cardId];
    // 봇 메시지로 카드 선택 결과를 보여주고, 선택한 카드 이름을 전송
    // 카드 선택 결과 메시지: 텍스트와 함께 카드 이미지 표시
    setMessages((prev) => [
      ...prev,
      {
        message: `"${selectedCard}" 카드를 선택했어!`,
        role: "assistant",
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
    handleSendMessage(selectedCard).then(() => {
      socket.emit("typing_stop", { room_id: sessionId });
    });
  };


  // =========================================
  // 페이지 진입 시 firstMessage가 있으면 바로 세팅하고 응답 생성
  // =========================================
  useEffect(() => {
    if (!socketRef.current) return;
    const socket = socketRef.current; // 최초의 socket 저장
    const storedMessage = localStorage.getItem("firstMessage");
    localStorage.removeItem("firstMessage"); // 꺼낸 뒤 즉시 삭제
  
    if (storedMessage) {
      setTimeout(() => {
        handleSendMessage(storedMessage).then(() => {
          socket.emit("typing_stop", { room_id: sessionId });
        });
      }, 200);
    }
  }, [handleSendMessage, socketRef, sessionId]);


  // =========================================
  // 새로운 메시지가 추가될 때마다 스크롤을 자동으로 맨 아래로 이동
  // =========================================
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // ----------------------------------------
  // 5초 무응답 -> macro 메시지
  // ----------------------------------------
  const handleUserInputIdle = useCallback((currentInput: string) => {
    // 최신 입력값을 즉시 업데이트
    lastInputRef.current = currentInput;
    
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  
    idleTimerRef.current = setTimeout(() => {
      console.log("⏳ [handleUserInputIdle] 5초 경과 후 체크 시작");
  
      // currentInput은 클로저에 잡힌 값이고, lastInputRef.current는 방금 업데이트한 값과 같을 것이므로
      if (currentInput.trim().length > 0 && currentInput === lastInputRef.current) {
        console.log("💡 [handleUserInputIdle] 사용자 입력이 5초 동안 없음 -> 자동 메시지 전송");
        const macroMsg = "괜찮으신가요? 필요하시면 언제든 말씀해주세요!";
        const latestSessionId = sessionIdRef.current;
        const latestBotId = botIdRef.current;
        const latestIsRoomJoined = isRoomJoinedRef.current;
        if (socketRef.current && latestIsRoomJoined) {
          console.log("📩 [handleUserInputIdle] macro 메시지 전송 중...");
          socketRef.current.emit("chat_message", {
            room_id: latestSessionId,
            user_id: "assistant",
            bot_id: latestBotId,
            user_input: macroMsg,
            type: "macro",
          });
        }
      }
      // ref에 저장 (상태 업데이트 없음)
      lastInputRef.current = currentInput;
    }, 10000);
  }, []);



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
              className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"} w-full`}
            >
              {msg.role === "assistant" ? (
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
                    {msg.message}
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
                    msg.role === storedUserId ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                  }`}
                >
                  {msg.message}
                </div>
              )}
            </div>
          ))}
          
          {/* 기존 단순 텍스트 대신 TypingIndicator 컴포넌트 사용 */}
          {typingUsers.length > 0 && (
            <div className="mb-4">
              {typingUsers.map((name, index) => (
                <TypingIndicator key={index} nickname={name} />
              ))}
            </div>
          )}

        {/* 🤖 챗봇 응답 생성 중일 때 채팅 영역 좌상단에 프로필 이미지 표시 */}
        {saying && tarotMaster?.profileImage && (
          <div className="absolute bottom-[20%] left-1/4 -translate-x-1/2 flex justify-center items-center bg-white p-1 rounded-full shadow-lg border border-gray-300 z-10">
            <Image
              src={tarotMaster.profileImage}
              alt="Chatbot Thinking"
              width={64}
              height={64}
              className="w-16 h-16 rounded-full animate-pulse"
            />
          </div>
        )}
      </div>

      {/* 카드 선택 UI (CardSelector 컴포넌트) */}
      {showCardSelector && 
      createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black bg-opacity-50">
          <CardSelector
            onCardSelect={handleCardSelect}
            onClose={() => setShowCardSelector(false)}
          />
        </div>, document.body
      )}

        {/* 하단 입력창 */}
        <ChatInput
          sessionId={sessionId}
          socketRef={socketRef} // ✅ socketRef를 추가!
          onSend={(val) => {
            // Enter로 메시지 전송해도 typing_stop은 안 보냄 (요구사항)
            handleSendMessage(val);
            lastInputRef.current = "";
          }}
          onInputChange={(val) => {
            handleUserInputIdle(val); // 5초 자동 메시지
          }}
        />
      </div>
    </div>
  );
}
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { API_URLS } from "@/config/api";
import ChatInput from "@/components/Chat/Input/ChatInput";
import Image from "next/image";
import CardSelector from "@/components/CardSelector";
import { tarotCards } from "@/utils/tarotCards";
import { useSession } from "@/context/SessionContext";
import { getTarotMaster } from "@/libs/api";
import { createPortal } from "react-dom";
import socketManager from "@/utils/socketManager";

// 타입 정의
interface RoomJoinedData {
  room_id: string;
}

interface ChatMessageData {
  message: string;
  role: string;
  type?: string;
  chat_tag?: string;
  response_id?: string;
  sequence?: number;
}

interface TypingIndicatorData {
  typing: boolean;
  nickname: string;
}

function TypingIndicator({ nickname }: { nickname: string }) {
  return (
    <div className="flex items-center px-4 py-2">
      <span className="mr-2 font-semibold text-gray-700">{nickname}</span>
      <div className="flex space-x-1">
        <span
          className="w-2 h-2 bg-gray-600 rounded-full animate-dotWave"
          style={{ animationDelay: "0s" }}
        ></span>
        <span
          className="w-2 h-2 bg-gray-600 rounded-full animate-dotWave"
          style={{ animationDelay: "0.2s" }}
        ></span>
        <span
          className="w-2 h-2 bg-gray-600 rounded-full animate-dotWave"
          style={{ animationDelay: "0.4s" }}
        ></span>
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
  const botId =
    new URLSearchParams(window.location.search).get("botId") ||
    localStorage.getItem("botId") ||
    "";
  const storedUserId = localStorage.getItem("userId") || "";
  const sessionId = sessionIdParam || "nosession";

  const [tarotMaster, setTarotMaster] = useState<TarotMaster>();
  const [chatType, setChatType] = useState("none");
  const [showTarotButton, setShowTarotButton] = useState(false);
  const [showCardSelector, setShowCardSelector] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<MessageForm[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const socketRef = useRef<ReturnType<typeof socketManager.getSocket> | null>(null);
  const hasClosedSessionRef = useRef(false);

  const [nickname, setNickname] = useState("");
  const [saying, setSaying] = useState(false);
  const [isRoomJoined, setIsRoomJoined] = useState(false);

  const pendingMessageRef = useRef<string | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const lastInputRef = useRef("");
  const sessionIdRef = useRef(sessionId);
  const botIdRef = useRef(botId);
  const isRoomJoinedRef = useRef(isRoomJoined);

  const { triggerSessionUpdate } = useSession();

  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const fetchProfileData = useCallback(async (): Promise<void> => {
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
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  useEffect(() => {
    sessionIdRef.current = sessionId;
    botIdRef.current = botId;
    isRoomJoinedRef.current = isRoomJoined;
  }, [sessionId, botId, isRoomJoined]);

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

  const handleSendMessage = useCallback(
    async (message: string) => {
      const updateChatSession = async () => {
        try {
          const response = await fetch(API_URLS.CHAT.UPDATE(sessionId), {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw new Error("채팅 세션 업데이트 실패");
          }
        } catch (err) {
          console.error("업데이트 에러:", err);
        }
      };

      if (!isRoomJoined) {
        console.warn("⚠️ 방 입장이 완료되지 않아 메시지를 대기열에 추가합니다.");
        pendingMessageRef.current = message;
        return;
      }

      if (!socketRef.current) return;

      updateChatSession().then(() => {
        triggerSessionUpdate();
      });

      socketManager.emit("chat_message", {
        room_id: sessionId,
        user_id: storedUserId,
        bot_id: botId,
        user_input: message,
        type: showTarotButton ? "none" : chatType,
      });

      setChatType("none");
    },
    [
      sessionId,
      chatType,
      showTarotButton,
      botId,
      storedUserId,
      isRoomJoined,
      triggerSessionUpdate,
    ]
  );

  useEffect(() => {
    if (sessionId === "nosession" || !storedUserId || !nickname) {
      console.log(
        "🚫 조건 불충족: sessionId=",
        sessionId,
        " userId=",
        storedUserId,
        " nickname=",
        nickname
      );
      return;
    }
    if (socketRef.current) {
      console.log("⚠️ 기존 소켓 연결이 존재함. 새 연결을 만들지 않음.");
      return;
    }

    const socket = socketManager.getSocket();
    socketRef.current = socket;

    socketManager.emit("join_room", {
      room_id: sessionId,
      user_id: storedUserId,
      nickname,
    });

    socketManager.onChat<RoomJoinedData>("room_joined", (data) => {
      console.log(`Room joined: ${data.room_id}`);
      setIsRoomJoined(true);
    });

    socketManager.onChat<ChatMessageData>("chat_message", (data) => {
      console.log(`📩 사용자 메시지 수신:`, data);
      if (data.role === "system" && data.type === "notification") {
        setMessages((prev) => [
          ...prev,
          {
            message: data.message,
            role: "system",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            message: data.message,
            role: data.role,
          },
        ]);
      }
    });

    socketManager.onChat<ChatMessageData>("chatbot_message", (data) => {
      console.log("🤖 챗봇 메시지 수신:", data);
      setSaying(false);

      setMessages((prev) => {
        const updatedMessages = [...prev];
        const existingIndex = updatedMessages
          .slice()
          .reverse()
          .findIndex(
            (msg) =>
              msg.role === "assistant" && msg.response_id === data.response_id
          );
        const realIndex =
          existingIndex >= 0 ? updatedMessages.length - 1 - existingIndex : -1;

        if (data.response_id && realIndex >= 0) {
          updatedMessages[realIndex].message += data.message;
        } else {
          setChatType(data.chat_tag || "none");
          if (data.chat_tag === "tarot result")
            hasClosedSessionRef.current = false;
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

    socketManager.onChat("saying", () => {
      setSaying(true);
      console.log("입력중...");
    });

    socketManager.onChat<TypingIndicatorData>("typing_indicator", (data) => {
      console.log("[typing_indicator]:", data);
      setTypingUsers((prev) => {
        if (data.typing) {
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

  useEffect(() => {
    if (typingUsers.length > 0 && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [typingUsers]);

  useEffect(() => {
    if (isRoomJoined && pendingMessageRef.current) {
      const pendingMessage = pendingMessageRef.current;
      console.log(
        "🔄 `isRoomJoined` 변경 감지, 대기 중이던 메시지 전송:",
        pendingMessage
      );
      (async () => {
        await handleSendMessage(pendingMessage);
        setTimeout(() => {
          if (socketRef.current) {
            socketManager.emit("typing_stop", { room_id: sessionId });
          }
        }, 300);
      })();
      pendingMessageRef.current = null;
    }
  }, [isRoomJoined, handleSendMessage, sessionId]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const storedMessage = localStorage.getItem("firstMessage");
    if (storedMessage) return;

    const loadSessionMessages = async () => {
      try {
        console.log("지금 메시지 로드");
        const response = await fetch(API_URLS.CHAT.LOAD_SESSION, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
          credentials: "include",
        });

        if (!response.ok)
          throw new Error("이전 대화 기록 불러오기 실패");

        const data = await response.json();

        setMessages(
          data.map((msg: MessageForm) => ({
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
          }))
        );
      } catch (error) {
        console.error("이전 대화 기록 불러오기 에러:", error);
      }
    };

    if (sessionId && sessionId !== "nosession") {
      loadSessionMessages();
    }
  }, [botId, sessionId]);

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
        setTimeout(() => setChatType("none"), 1000);
        triggerSessionUpdate();
      });
    }
  }, [chatType, sessionId, storedUserId, botId, triggerSessionUpdate]);

  const handleShowCardSelector = () => {
    setShowTarotButton(false);
    setShowCardSelector(true);
  };

  const handleCardSelect = (cardId: string) => {
    if (!socketRef.current) return;
    setShowCardSelector(false);
    const selectedCard = tarotCards[cardId];
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
    handleSendMessage(selectedCard).then(() => {
      socketManager.emit("typing_stop", { room_id: sessionId });
    });
  };

  useEffect(() => {
    if (!socketRef.current) return;
    const storedMessage = localStorage.getItem("firstMessage");
    localStorage.removeItem("firstMessage");
    if (storedMessage) {
      setTimeout(() => {
        handleSendMessage(storedMessage).then(() => {
          socketManager.emit("typing_stop", { room_id: sessionId });
        });
      }, 200);
    }
  }, [handleSendMessage, sessionId]);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleUserInputIdle = useCallback((currentInput: string) => {
    lastInputRef.current = currentInput;
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      console.log("⏳ [handleUserInputIdle] 5초 경과 후 체크 시작");
      if (currentInput.trim().length > 0 && currentInput === lastInputRef.current) {
        console.log("💡 [handleUserInputIdle] 사용자 입력이 5초 동안 없음 -> 자동 메시지 전송");
        const macroMsg =
          "괜찮으신가요? 필요하시면 언제든 말씀해주세요!";
        const latestSessionId = sessionIdRef.current;
        const latestBotId = botIdRef.current;
        const latestIsRoomJoined = isRoomJoinedRef.current;
        if (socketRef.current && latestIsRoomJoined) {
          console.log("📩 [handleUserInputIdle] macro 메시지 전송 중...");
          socketManager.emit("chat_message", {
            room_id: latestSessionId,
            user_id: "assistant",
            bot_id: latestBotId,
            user_input: macroMsg,
            type: "macro",
          });
        }
      }
      lastInputRef.current = currentInput;
    }, 10000);
  }, []);

  return (
    <div
      className={
        isMobile
          ? "relative h-screen bg-purple-50"
          : "flex flex-col h-screen bg-purple-50 rounded-lg"
      }
    >
      <div
        className={
          isMobile
            ? "relative z-10 flex flex-col h-screen bg-purple-50"
            : "flex flex-col h-screen"
        }
        style={isMobile ? { height: "calc(100vh - 3.5rem)" } : {}}
      >
        <div
          ref={chatContainerRef}
          className="flex-1 px-6 py-4 space-y-4 overflow-auto mb-4 sm:mb-14"
        >
          {messages.map((msg, index) => {
            if (msg.role === "system") {
              return (
                <div key={index} className="flex justify-center my-2">
                  <div className="text-gray-500 text-sm italic">
                    {msg.message}
                  </div>
                </div>
              );
            }

            if (msg.role === "assistant") {
              return (
                <div key={index} className="flex justify-start w-full my-2">
                  <Image
                    src={
                      tarotMaster?.profileImage ||
                      `/bots/${botId}_profile.png`
                    }
                    alt="Bot Profile"
                    width={128}
                    height={128}
                    className="w-10 h-10 md:w-16 md:h-16 rounded-full mr-2 md:mr-3"
                  />
                  <div className="px-4 py-2 bg-gray-100 rounded-lg max-w-[80%] md:max-w-[60%] text-gray-800 leading-relaxed shadow">
                    {msg.message}
                    {msg.content && <div className="mt-2">{msg.content}</div>}
                    {index === messages.length - 1 &&
                      chatType === "tarot" && (
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
              );
            }

            const isCurrentUser = msg.role === storedUserId;
            return (
              <div
                key={index}
                className={`flex w-full my-2 ${
                  isCurrentUser ? "justify-end" : "justify-end"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-[80%] md:max-w-[60%] leading-relaxed shadow
                    ${
                      isCurrentUser
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-black"
                    }
                  `}
                >
                  {msg.message}
                </div>
              </div>
            );
          })}

          {(typingUsers.length > 0 ||
            (saying && tarotMaster?.name)) && (
            <div className="mb-4">
              {saying && tarotMaster?.name && (
                <TypingIndicator key="tarot" nickname={tarotMaster.name} />
              )}
              {typingUsers.map((name, index) => (
                <TypingIndicator key={index} nickname={name} />
              ))}
            </div>
          )}
        </div>

        {showCardSelector &&
          createPortal(
            <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black bg-opacity-50">
              <CardSelector
                onCardSelect={handleCardSelect}
                onClose={() => setShowCardSelector(false)}
              />
            </div>,
            document.body
          )}

        <ChatInput
          sessionId={sessionId}
          socketRef={socketRef}
          onSend={(val) => {
            handleSendMessage(val);
            lastInputRef.current = "";
          }}
          onInputChange={(val) => {
            handleUserInputIdle(val);
          }}
        />
      </div>
    </div>
  );
}

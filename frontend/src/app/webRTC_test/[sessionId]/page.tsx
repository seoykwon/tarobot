"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { OpenVidu, Session, Publisher, Subscriber } from "openvidu-browser";
import Draggable from "react-draggable";
import ChatComponent from "../ChatComponent";
import { useParams } from "next/navigation";
import { API_URLS } from "@/config/api";

const OPENVIDU_SESSIONS_URL = API_URLS.OPENVIDU.SESSIONS;
const OPENVIDU_CONNECTIONS_URL = API_URLS.OPENVIDU.CONNECTIONS;

export default function OpenviduCallPage() {
  // 동적 라우팅으로부터 sessionId 받아오기
  const params = useParams();
  const sessionId = params.sessionId as string;

  // 사용자 이름을 백엔드에서 받아오기
  const [userName, setUserName] = useState("imsi");
  useEffect(() => {
    async function fetchUserName() {
      try {
        const response = await fetch(API_URLS.USERNOW.PROFILE, {
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch user profile");

        const data = await response.json();
        setUserName(data?.name || "imsi");
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    }
    fetchUserName();
  }, []);

  // OpenVidu 관련 상태
  const [session, setSession] = useState<Session | null>(null);
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // useRef로 OpenVidu 인스턴스 보관
  const OVRef = useRef<OpenVidu | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  /**
   * 세션 참가 함수 (joinSession)
   * 의존성: sessionId, userName
   */
  const joinSession = useCallback(async () => {
    try {
      // OpenVidu 인스턴스 초기화
      OVRef.current = new OpenVidu();

      // 1. 세션 생성(서버에 요청)
      const sessionResponse = await fetch(OPENVIDU_SESSIONS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ custom_session_id: sessionId }),
      });
      const sessionData = await sessionResponse.json();

      // 2. 토큰 발급
      const tokenResponse = await fetch(OPENVIDU_CONNECTIONS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionData.id }),
      });
      const tokenData = await tokenResponse.json();

      // 3. 세션 초기화
      const mySession = OVRef.current.initSession();

      // 4. 스트림 생성/삭제 이벤트 등록
      mySession.on("streamCreated", (event) => {
        const subscriber = mySession.subscribe(event.stream, undefined);
        setSubscribers((prev) => [...prev, subscriber]);
      });

      mySession.on("streamDestroyed", (event) => {
        setSubscribers((prev) =>
          prev.filter(
            (sub) =>
              sub.stream.connection.connectionId !==
              event.stream.connection.connectionId
          )
        );
      });

      // 5. 세션 연결
      await mySession.connect(tokenData.token, { clientData: userName });

      // 6. 로컬 퍼블리셔 생성
      const localPublisher = OVRef.current.initPublisher(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: "640x480",
        frameRate: 30,
        mirror: true,
        insertMode: "APPEND",
      });

      // 퍼블리셔 비디오 스타일 적용
      localPublisher.on("videoElementCreated", (event) => {
        event.element.style.width = "100%";
        event.element.style.height = "100%";
      });

      // 7. 퍼블리셔를 세션에 추가
      await mySession.publish(localPublisher);

      // 8. 상태 저장
      setSession(mySession);
      setPublisher(localPublisher);
    } catch (error) {
      console.error("Error joining session:", error);
    }
  }, [sessionId, userName]);

  /**
   * 세션 종료 함수 (leaveSession)
   * 의존성: publisher, session
   */
  const leaveSession = useCallback(() => {
    if (publisher) {
      // WebRTC 리소스 해제
      publisher.stream.disposeWebRtcPeer();
      publisher.stream.disposeMediaStream();
    }
    if (session) {
      // 세션 연결 해제
      session.disconnect();
    }
    // 컴포넌트 상태 초기화
    setSession(null);
    setPublisher(null);
    setSubscribers([]);
    // OpenVidu 인스턴스 제거
    OVRef.current = null;
  }, [publisher, session]);

  /**
   * 컴포넌트 마운트 시에는 joinSession, 언마운트 시에는 leaveSession
   * 경고 해결: [joinSession, leaveSession]를 의존성 배열에 포함
   */
  useEffect(() => {
    joinSession();
    return () => {
      leaveSession();
    };
  }, [joinSession, leaveSession]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        OpenVidu Video Call – 현재 세션: {sessionId}
      </h1>

      <div className="mb-4 flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            onClick={leaveSession}
            className="bg-red-500 text-white p-2 rounded"
          >
            Leave Session
          </button>
        </div>
      </div>

      {/* 채팅 컴포넌트 */}
      <div className="w-1/3 h-full bg-white">
        <ChatComponent sessionId={sessionId} userName={userName} />
      </div>

      {/* PIP(Picture-in-Picture) 비디오 영역 */}
      <Draggable>
        <div
          onClick={() => setIsExpanded((prev) => !prev)}
          className={`fixed top-4 right-4 bg-black rounded-lg shadow-lg z-50 cursor-pointer transition-all duration-300 ${
            isExpanded ? "w-[800px] h-[300px]" : "w-[400px] h-[150px]"
          }`}
        >
          <div className="flex w-full h-full">
            <div className="w-1/2 h-full border-r border-gray-600">
              <video ref={localVideoRef} className="w-full h-full" autoPlay />
            </div>
            <div className="w-1/2 h-full">
              <div className="w-full h-full flex flex-wrap">
                {subscribers.length > 0 ? (
                  subscribers.map((subscriber, index) => (
                    <div key={index} className="w-full h-full">
                      <SubscriberComponent subscriber={subscriber} />
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    No Remote Video
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
}

/** 구독자용 비디오 컴포넌트 */
function SubscriberComponent({ subscriber }: { subscriber: Subscriber }) {
  const subscriberRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (subscriberRef.current) {
      subscriber.addVideoElement(subscriberRef.current);
    }
  }, [subscriber]);

  return <video ref={subscriberRef} className="w-full h-full" />;
}

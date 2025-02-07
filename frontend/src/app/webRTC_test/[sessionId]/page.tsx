"use client";

import React, { useEffect, useRef, useState } from "react";
import { OpenVidu, Session, Publisher, Subscriber } from "openvidu-browser";
import Draggable from "react-draggable";
import ChatComponent from "../ChatComponent";
import { useParams } from "next/navigation";

const OPENVIDU_SESSIONS_URL = "http://localhost:8000/openvidu/sessions";
const OPENVIDU_CONNECTIONS_URL = "http://localhost:8000/openvidu/connections";

export default function OpenviduCallPage() {
  // 동적 라우팅으로부터 sessionId 받아오기
  const params = useParams();
  const sessionId = (params.sessionId as string);

  // userName은 백엔드에서 받아오도록 하며, 실패할 경우 "imsi"를 사용
  const [userName, setUserName] = useState("");
  useEffect(() => {
    async function fetchUserName() {
      try {
        // 예시 URL – 실제 상황에 맞게 수정하세요.
        const response = await fetch("http://localhost:8080/api/v1/user/me", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const data = await response.json();
        if (data && data.name) {
          setUserName(data.name);
        } else {
          setUserName("imsi");
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
        setUserName("imsi");
      }
    }
    fetchUserName();
  }, []);

  const [session, setSession] = useState<Session | null>(null);
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const localVideoRef = useRef<HTMLDivElement>(null);
  const OVRef = useRef<OpenVidu | null>(null);

  // 페이지 진입시 세션에 자동 연결 (이 페이지 자체가 세션 시작)
  useEffect(() => {
    joinSession();
    return () => {
      leaveSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const joinSession = async () => {
    try {
      OVRef.current = new OpenVidu();

      // 세션 생성(또는 재사용) 호출
      const sessionResponse = await fetch(OPENVIDU_SESSIONS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ custom_session_id: sessionId }),
      });
      const sessionData = await sessionResponse.json();

      // 토큰 발급 요청
      const tokenResponse = await fetch(OPENVIDU_CONNECTIONS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionData.id }),
      });
      const tokenData = await tokenResponse.json();

      const mySession = OVRef.current.initSession();

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

      // userName은 이미 set되어 있을 것이며, fallback은 "imsi"
      await mySession.connect(tokenData.token, { clientData: userName });

      // 로컬 Publisher 생성 – 거울 모드 활성화
      const myPublisher = OVRef.current.initPublisher(localVideoRef.current, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: "640x480",
        frameRate: 30,
        mirror: true, // 거울 모드 활성화
        insertMode: "APPEND",
      });

      myPublisher.on("videoElementCreated", (event) => {
        event.element.style.width = "100%";
        event.element.style.height = "100%";
      });

      await mySession.publish(myPublisher);

      setSession(mySession);
      setPublisher(myPublisher);
    } catch (error) {
      console.error("Error joining session:", error);
    }
  };

  const leaveSession = () => {
    if (publisher) {
      publisher.stream.disposeWebRtcPeer();
      publisher.stream.disposeMediaStream();
    }
    if (session) {
      session.disconnect();
    }
    setSession(null);
    setPublisher(null);
    setSubscribers([]);
    OVRef.current = null;
  };

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

      {/* Chat Component */}
      <div className="w-1/3 h-full bg-white">
        <ChatComponent sessionId={sessionId} userName={userName} />
      </div>

      {/* PIP 비디오 영역 */}
      <Draggable>
        <div
          onClick={() => setIsExpanded((prev) => !prev)}
          className={`fixed top-4 right-4 bg-black rounded-lg shadow-lg z-50 cursor-pointer transition-all duration-300 ${
            isExpanded ? "w-[800px] h-[300px]" : "w-[400px] h-[150px]"
          }`}
        >
          <div className="flex w-full h-full">
            {/* Local Video – 왼쪽 절반 */}
            <div className="w-1/2 h-full border-r border-gray-600">
              <div ref={localVideoRef} className="w-full h-full" />
            </div>
            {/* Remote Video – 오른쪽 절반 */}
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

function SubscriberComponent({ subscriber }: { subscriber: Subscriber }) {
  const subscriberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (subscriberRef.current) {
      subscriber.addVideoElement(subscriberRef.current);
    }
    return () => {
      if (subscriberRef.current) {
        subscriberRef.current.innerHTML = "";
      }
    };
  }, [subscriber]);

  return <div ref={subscriberRef} className="w-full h-full" />;
}

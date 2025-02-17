// chat/[sessionId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import ChatWindowWs from "@/components/ChatWindowWs";
import VoiceChat from "@/components/VoiceChat";
import Image from "next/image";

export default function ChatSessionPage({ params }: { params: { sessionId: string } }) {
  const { sessionId } = params;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    // 모바일: 두 영역을 세로로 스택
    return (
      <div className="relative h-screen">
        {/* 백그라운드 이미지 */}
        <div className="absolute inset-0">
          <Image
            src="/images/dummy1.png"
            alt="배경 이미지"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-[rgba(70,35,10,0.3)]"></div>
        <div className="relative z-10 flex flex-col h-screen">
          <div className="flex-1 overflow-auto">
            <ChatWindowWs sessionIdParam={sessionId} />
          </div>
          <div className="border-t">
            <VoiceChat roomId={sessionId} />
          </div>
        </div>
      </div>
    );
  }

  // 데스크탑: 좌측에 이미지 영역, 우측에 텍스트 & 음성 채팅 영역 (상단 텍스트, 하단 음성)
  return (
    <div className="grid grid-cols-3 h-screen bg-purple-100">
      {/* 좌측 이미지 영역 */}
      <div className="col-span-1 w-full p-4 flex flex-col gap-4">
        <div className="relative flex-1 bg-purple-100 rounded-lg flex items-center justify-center overflow-hidden aspect-[3/2]">
          <Image
            src="/images/dummy1.png"
            alt="이미지 1"
            fill
            className="object-contain"
          />
        </div>
        <div className="relative flex-1 bg-purple-100 rounded-lg flex items-center justify-center overflow-hidden aspect-[3/2]">
          <Image
            src="/images/dummy2.png"
            alt="이미지 2"
            fill
            className="object-contain"
          />
        </div>
      </div>
      {/* 우측 채팅 영역 */}
      <div className="col-span-2 flex-1">
        {/* <ChatWindow sessionIdParam={sessionId} /> */}
        <ChatWindowWs sessionIdParam={sessionId} />
      </div>
      {/* <div className="col-span-2 flex flex-col">
        <div className="flex-1 overflow-auto">
          <ChatWindowWs sessionIdParam={sessionId} />
        </div>
        <div className="h-40 border-t p-4">
          <VoiceChat roomId={sessionId} />
        </div>
      </div> */}
    </div>
  );
}

// chat/[sessionId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import ChatWindowWs from "@/components/ChatWindowWs";
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

  return (
    <div className="relative h-screen">
      {/* 배경 이미지 및 오버레이 */}
      <div className="absolute inset-0">
        <Image
          src="/images/dummy1.png"
          alt="배경 이미지"
          fill
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-[rgba(70,35,10,0.3)]"></div>

      {/* 레이아웃 컨테이너 */}
      <div className="relative z-10 h-full grid grid-cols-3 bg-purple-100">
        {/* 데스크탑에서는 좌측에 이미지 영역, 모바일에서는 숨김 */}
        <div className={`col-span-1 p-4 flex flex-col gap-4 ${isMobile ? "hidden" : "block"}`}>
          <div className="relative flex-1 rounded-lg overflow-hidden aspect-[3/2]">
            <Image
              src="/images/dummy1.png"
              alt="이미지 1"
              fill
              className="object-contain"
            />
          </div>
          <div className="relative flex-1 rounded-lg overflow-hidden aspect-[3/2]">
            <Image
              src="/images/dummy2.png"
              alt="이미지 2"
              fill
              className="object-contain"
            />
          </div>
        </div>
        {/* 채팅 영역은 모바일에서는 전체 너비, 데스크탑에서는 우측 2/3 */}
        <div className={`${isMobile ? "col-span-3" : "col-span-2"} flex flex-col h-full`}>
          <ChatWindowWs sessionIdParam={sessionId} />
        </div>
      </div>
    </div>
  );
}

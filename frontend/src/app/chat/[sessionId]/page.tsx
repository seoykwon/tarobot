"use client";

import { useState, useEffect } from "react";
import ChatWindow from "@/components/ChatWindow";
import Image from "next/image";

export default function Hoon({ params }: { params: { sessionId: string } }) {
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
    return (
      <div className="relative h-screen">
        {/* 백그라운드 이미지 영역 */}
        <div className="absolute inset-0">
          <Image
            src="/images/dummy1.png"
            alt="배경 이미지"
            fill
            className="object-cover"
          />
        </div>
        {/* 검정과 갈색을 혼합한 반투명 오버레이 */}
        <div className="absolute inset-0 bg-[rgba(70,35,10,0.3)]"></div>
        {/* 채팅창 영역 */}
        <div className="relative z-10 flex flex-col h-screen">
          <ChatWindow sessionIdParam={sessionId} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 h-screen bg-purple-100">
      {/* 좌측 이미지 영역 - min-w 제거하고 w-full로 변경 */}
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

      {/* 우측 ChatWindow 영역 */}
      <div className="col-span-2 flex-1">
        <ChatWindow sessionIdParam={sessionId} />
      </div>
    </div>
  );
}

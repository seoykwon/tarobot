// src/app/chat/[sessionId]/page.tsx
"use client";

import ChatWindowWs from "@/components/ChatWindowWs";

export default function ChatSessionPage({ params }: { params: { sessionId: string } }) {
  const { sessionId } = params;

  return (
    <div className="relative h-screen">
      {/* 배경 이미지 및 오버레이 */}

      {/* 채팅창을 화면 중앙에 배치 */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="w-full max-w-3xl p-2 bg-purple-50">
          <ChatWindowWs sessionIdParam={sessionId} />
        </div>
      </div>
    </div>
  );
}

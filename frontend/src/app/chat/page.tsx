// chat/page.tsx
"use client";

import ChatStandby from "@/components/ChatStandby";

export default function ChatPage() {
  // 데스크탑 등 모바일이 아닐 경우: 이미지 영역 없이 ChatStandby 컴포넌트만 전체 화면에 표시합니다.
  return (
    <div className="relative h-screen">
      {/* 채팅창을 화면 중앙에 배치 */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="w-full max-w-3xl p-2 bg-purple-50">
          <ChatStandby />
        </div>
      </div>
    </div>
  );
}
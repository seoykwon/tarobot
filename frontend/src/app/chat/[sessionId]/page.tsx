// src/app/chat/[sessionId]/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatWindowWs from "@/components/Chat/ChatWindowWs";
import { API_URLS } from "@/config/api";

export default function ChatSessionPage({ params }: { params: { sessionId: string } }) {
  const { sessionId } = params;
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await fetch(API_URLS.TOKEN.VALIDATE, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const userId = data.userId;
          localStorage.setItem("userId", userId);
          // 로그인 성공 시 추가 작업이 필요한 경우 여기에 작성 (예: 별도 처리)
        } else {
          alert("로그인에 실패했습니다. 다시 시도해주세요.");
          router.push(`/?redirect=${encodeURIComponent(window.location.pathname)}`);
        }
      } catch (error) {
        console.error("토큰 검증 중 에러 발생:", error);
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
        router.push(`/?redirect=${encodeURIComponent(window.location.pathname)}`);
      }
    };

    checkLogin();
  }, [router]);

  return (
    <div className="relative h-screen">
      {/* 채팅창을 화면 중앙에 배치 */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="w-full max-w-3xl p-2 bg-purple-50">
          <ChatWindowWs sessionIdParam={sessionId} />
        </div>
      </div>
    </div>
  );
}

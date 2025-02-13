"use client";

import Sidebar from "@/app/khoon/components/Sidebar";
import Header from "@/app/khoon/components/Header";
import { useState, useEffect } from "react";

export default function KhoonLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true); // ✅ 기본값 true
  const [isMobile, setIsMobile] = useState<boolean | null>(null); // ✅ 초기 값 null (Hydration 방지)

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 768;
      setIsMobile(mobileView);
      setIsSidebarOpen(!mobileView); // ✅ 모바일이면 사이드바 자동 닫힘
    };

    handleResize(); // ✅ 초기 실행 시 화면 크기 체크
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Hydration 오류 방지: isMobile이 `null`일 경우 아무것도 렌더링하지 않음
  if (isMobile === null) return null;

  return (
    <html lang="ko">
      <body className="flex min-h-screen bg-gray-100">
        {/* ✅ Sidebar */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* ✅ Main Content */}
        <div
          className={`flex flex-col flex-1 transition-all duration-300 ${
            isMobile ? "w-full ml-0" : isSidebarOpen ? "ml-64 w-[calc(100%-16rem)]" : "ml-16 w-[calc(100%-4rem)]"
          }`}
        >
          {/* ✅ Header */}
          <Header isSidebarOpen={isSidebarOpen} />

          {/* ✅ Content */}
          <div className="flex-1 bg-purple-50 pt-14 overflow-hidden">{children}</div>
        </div>
      </body>
    </html>
  );
}

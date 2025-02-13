"use client";

import Sidebar from "@/app/khoon/components/Sidebar";
import Header from "@/app/khoon/components/Header";
import { useState, useEffect } from "react";

export default function KhoonLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true); // ✅ null이 아니라 true로 설정
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <html lang="ko">
      <body className="flex h-screen bg-gray-100">
        {/* 🟢 Sidebar */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* 🟢 우측 컨텐츠 */}
        <div
          className={`flex flex-col transition-all duration-300 ${
            isMobile ? "w-full ml-0" : isSidebarOpen ? "ml-64 w-[calc(100%-16rem)]" : "ml-16 w-[calc(100%-4rem)]"
          }`}
        >
          {/* 🟢 Header */}
          <Header isSidebarOpen={isSidebarOpen} />

          {/* 🟢 Main Content */}
          <div className="flex-1 bg-purple-50 pt-14 overflow-hidden">{children}</div>
        </div>
      </body>
    </html>
  );
}

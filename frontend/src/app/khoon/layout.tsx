"use client";

import Sidebar from "@/app/khoon/components/sidebar";
import Header from "@/app/khoon/components/header";
import { useState, useEffect } from "react";

export default function KhoonLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      const mobileView = window.innerWidth < 768;
      setIsMobile(mobileView);
      setIsSidebarOpen(!mobileView);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 서버와 클라이언트 간 HTML 차이를 방지하기 위해 마운트 전에는 null 혹은 로딩 상태를 반환
  if (!mounted) {
    return null;
  }

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

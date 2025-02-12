"use client";

import Sidebar from "@/app/khoon/components/sidebar";
import Header from "@/app/khoon/components/header";
import { useState, useEffect } from "react";

export default function KhoonLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean | null>(null);

  useEffect(() => {
    setIsSidebarOpen(true);
  }, []);

  if (isSidebarOpen === null) {
    return null;
  }

  return (
    <html lang="ko">
      <body className="flex h-screen bg-gray-100">
        {/* 🟢 Sidebar (항상 고정) */}
        <div className={`fixed top-0 left-0 h-full transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"}`}>
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        </div>

        {/* 🟢 우측 컨텐츠 */}
        <div className={`flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64 w-[calc(100%-16rem)]" : "ml-16 w-[calc(100%-4rem)]"}`}>
          {/* 🟢 Header (Sidebar 상태 전달) */}
          <Header isSidebarOpen={isSidebarOpen} />

          {/* 🟢 Main Content */}
          <div className="flex-1 bg-purple-50 pt-14 p-6 overflow-auto">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}

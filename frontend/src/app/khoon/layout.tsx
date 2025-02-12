// components/Layout.tsx
"use client"

import Sidebar from "@/app/khoon/components/sidebar";
import Header from "./components/header";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // 사이드바 상태 공유

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 사이드바 */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* 우측 컨텐츠 (Header 포함) */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        {/* 상단바 */}
        <Header />

        {/* 메인 컨텐츠 */}
        <div className="flex-1 bg-purple-50">{children}</div>
      </div>
    </div>
  );
}

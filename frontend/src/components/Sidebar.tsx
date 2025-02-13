"use client";

import { useState, useEffect } from "react";

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // md 이하일 때 true
      if (window.innerWidth < 768) setIsOpen(false); // 모바일 환경에서는 자동으로 닫힘
    };

    handleResize(); // 초기 실행
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  return (
    <>
      {/* 사이드바 (오버레이 모드) */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-md transition-all duration-300 z-50 ${
          isMobile ? (isOpen ? "w-64" : "w-0 opacity-0") : isOpen ? "w-64" : "w-16"
        }`}
      >
        <button className="text-2xl p-2 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>

        {/* 사이드바 내용 (모바일에서는 오버레이처럼 동작) */}
        {isOpen && (
          <div className="p-4">
            <ul>
              <li className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">👤 타로 마스터 1</li>
              <li className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">👤 타로 마스터 2</li>
              <li className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">🔍 다른 타로 마스터 찾기</li>
            </ul>
          </div>
        )}
      </div>

      {/* 오버레이 배경 (모바일에서만 활성화) */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)} // 클릭 시 닫힘
        ></div>
      )}
    </>
  );
}

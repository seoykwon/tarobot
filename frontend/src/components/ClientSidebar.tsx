"use client";

import { useState, useEffect } from "react";
import DiaryModal from "@/components/Diary";

export default function ClientSidebar({ isOpen, setIsOpen, children }: { 
  isOpen: boolean; 
  setIsOpen: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) setIsOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-md transition-all duration-300 z-50 ${
          isMobile ? (isOpen ? "w-64" : "w-0 opacity-0") : isOpen ? "w-64" : "w-16"
        } overflow-y-auto`}
      >
        <button className="text-2xl p-4 focus:outline-none hover:bg-gray-800 transition" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>

        {isOpen && (
          <div className="p-4 flex flex-col justify-between h-full">
            {children}
            <button
              className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-lg flex items-center justify-center mt-auto transition"
              onClick={() => setIsDiaryOpen(true)}
            >
              📖 <span className="ml-2">다이어리</span>
            </button>
          </div>
        )}
      </div>

      {/* 다이어리 모달: 배경 오버레이와 모달 컨테이너로 분리 */}
      {isDiaryOpen && (
        <>
          {/* 풀스크린 배경 오버레이 (z-index 99) */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[99]"
            onClick={() => setIsDiaryOpen(false)}
          ></div>
  
          {/* 모달 컨테이너: 오버레이보다 높은 z-index (100) */}
          <div className="fixed inset-0 flex items-center justify-center z-[100]">
            <DiaryModal onClose={() => setIsDiaryOpen(false)} />
          </div>
        </>
      )}

      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[40]"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

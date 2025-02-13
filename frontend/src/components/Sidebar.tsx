"use client";

import { useState, useEffect } from "react";
import DiaryModal from "@/components/Diary";

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
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
      {/* 사이드바 */}
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
            <ul className="space-y-4">
              <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer">
                👤 <span>타로 마스터 1</span>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer">
                👤 <span>타로 마스터 2</span>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer">
                🔍 <span>다른 타로 마스터 찾기</span>
              </li>
            </ul>

            {/* 다이어리 버튼 */}
            <button
              className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-lg flex items-center justify-center mt-auto transition"
              onClick={() => setIsDiaryOpen(true)}
            >
              📖 <span className="ml-2">다이어리</span>
            </button>
          </div>
        )}
      </div>

      {/* 다이어리 모달 오버레이 */}
      {isDiaryOpen && (
        <>
          {/* 배경 오버레이 */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[99]"
            onClick={() => setIsDiaryOpen(false)} // 배경 클릭 시 닫힘
          ></div>

          {/* 다이어리 모달 */}
          <div className="fixed inset-0 flex items-center justify-center z-[100]">
            <DiaryModal onClose={() => setIsDiaryOpen(false)} />
          </div>
        </>
      )}

      {/* 모바일 오버레이 배경 */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[40]"
          onClick={() => setIsOpen(false)} // 클릭 시 사이드바 닫힘
        ></div>
      )}
    </>
  );
}

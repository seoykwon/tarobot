"use client";

import { useState, useEffect, useRef } from "react";
import ProfileOverlay from "./ProfileOverlay";
import NotificationOverlay from "./NotificationOverlay";
import DiaryModal from "@/components/Diary";

export default function Header({
  isSidebarOpen,
  isMobile,
  toggleSidebar,
}: {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}) {
  const [activeOverlay, setActiveOverlay] = useState<"notification" | "profile" | null>(null);
  const [isDiaryOpen, setIsDiaryOpen] = useState(false); // 다이어리 모달 상태 추가
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node) &&
      overlayRef.current &&
      !overlayRef.current.contains(event.target as Node)
    ) {
      setActiveOverlay(null);
    }
  };

  useEffect(() => {
    if (activeOverlay) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeOverlay]);

  const toggleOverlay = (type: "notification" | "profile") => {
    setActiveOverlay((prev) => (prev === type ? null : type));
  };

  return (
    <>
      <div
        ref={containerRef}
        className={`fixed top-0 right-0 h-14 bg-purple-100 flex items-center justify-between px-6 z-50 transition-all duration-300 ${
          isMobile ? "w-full ml-0" : isSidebarOpen ? "w-[calc(100%-16rem)] ml-64" : "w-[calc(100%-4rem)] ml-16"
        }`}
      >
        {/* 좌측: 로고 및 사이드바 토글 버튼 */}
        <div className="flex items-center gap-4">
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="text-2xl focus:outline-none hover:bg-[#ece6f0] rounded-lg p-2 transition"
            >
              ☰
            </button>
          )}
          <h1 className="text-xl font-bold text-[#1d1b20]">미루</h1>
        </div>

        {/* 우측: 알림 & 프로필 버튼 */}
        <div className="relative flex gap-4 items-center" ref={overlayRef}>
          {/* 다이어리 버튼 (아이콘만) */}
          <button
            className="text-2xl hover:bg-[#ece6f0] rounded-lg p-2 transition"
            onClick={() => setIsDiaryOpen(true)}
          >
            📖
          </button>

          {/* 알림 버튼 */}
          <NotificationOverlay
            isActive={activeOverlay === "notification"}
            toggle={() => toggleOverlay("notification")}
          />

          {/* 프로필 버튼 */}
          <ProfileOverlay
            isActive={activeOverlay === "profile"}
            toggle={() => toggleOverlay("profile")}
          />
        </div>
      </div>

      {/* 다이어리 모달 */}
      {isDiaryOpen && (
        <>
          {/* 풀스크린 배경 오버레이 */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[99]" onClick={() => setIsDiaryOpen(false)} />

          {/* 모달 컨테이너 */}
          <div className="fixed inset-0 flex items-center justify-center z-[100]">
            <DiaryModal onClose={() => setIsDiaryOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}

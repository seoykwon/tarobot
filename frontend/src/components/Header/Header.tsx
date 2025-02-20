"use client";

import { useState, useEffect, useRef } from "react";
import ProfileOverlay from "@/components/Header/ProfileOverlay";
import NotificationOverlay from "@/components/Header/NotificationOverlay";
import DiaryModal from "@/components/Diary/Diary";
import { useSession } from "@/context/SessionContext";
import { getBotName } from "@/utils/botNameMap";

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
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // SessionContext에서 botId를 가져옵니다.
  const { botId } = useSession();

  // utils의 getBotName을 통해 botName을 결정합니다.
  const botName = getBotName(botId);

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
        className={`fixed top-0 right-0 h-14 bg-purple-100 flex items-center justify-between pr-6 z-50 transition-all duration-300 ${
    isMobile ? "w-full ml-0 pl-0" : isSidebarOpen ? "w-[calc(100%-16rem)] ml-64 pl-6" : "w-[calc(100%-4rem)] ml-16 pl-6"
        }`}
      >
        {/* 좌측: 로고 및 사이드바 토글 버튼 */}
        <div className="flex items-center gap-4">
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="text-2xl focus:outline-none hover:bg-gray-200 transition h-14 w-14 flex items-center justify-center rounded-full"
            >
              ☰
            </button>
          )}
          <h1 className="text-xl font-bold text-[#1d1b20]">{botName}</h1>
        </div>

        {/* 우측: 알림 & 프로필 버튼 */}
        <div className="relative flex gap-4 items-center" ref={overlayRef}>
          {/* 다이어리 버튼 (아이콘만) */}
          <button
            className="text-2xl hover:bg-[#ece6f0] rounded-lg p-2 transition"
            onClick={() => setIsDiaryOpen(true)}
          >
            <img src="/book.png" alt="Book Icon" className="w-8 h-8 flex items-center justify-center" />
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
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[99]" onClick={() => setIsDiaryOpen(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-[100]">
            <DiaryModal onClose={() => setIsDiaryOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}
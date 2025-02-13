"use client"

import { useState, useEffect } from "react"
import DiaryModal from "@/components/Diary"
import type React from "react"

export default function ClientSidebar({
  isOpen,
  setIsOpen,
  children,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  children: React.ReactNode
}) {
  const [isMobile, setIsMobile] = useState(false)
  const [isDiaryOpen, setIsDiaryOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) setIsOpen(false)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [setIsOpen])

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full bg-[#ffffff] shadow-md transition-all duration-300 z-50 flex flex-col
          ${isMobile ? (isOpen ? "w-64" : "w-0") : isOpen ? "w-64" : "w-16"}
          ${!isOpen && isMobile ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
      >
        <button
          className="text-2xl p-4 focus:outline-none hover:bg-[#ece6f0] transition rounded-lg shrink-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        {/* 컨텐츠 영역 - isOpen 상태와 관계없이 항상 렌더링하되 visibility로 제어 */}
        <div className={`flex flex-col flex-1 ${!isOpen ? "invisible" : ""}`}>
          {/* 스크롤 가능한 컨텐츠 영역 */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {children}
          </div>

          {/* 하단 고정 다이어리 버튼 */}
          <div className="p-4 border-t border-gray-200 bg-[#ffffff]">
            <button
              className="bg-[#ffffff] hover:bg-[#49454f] text-[#0D0D0D] p-3 rounded-lg flex items-center justify-start w-full gap-2 transition"
              onClick={() => setIsDiaryOpen(true)}
            >
              📖 <span className="ml-2">다이어리</span>
            </button>
          </div>
        </div>
      </div>

      {/* 다이어리 모달: 배경 오버레이와 모달 컨테이너로 분리 */}
      {isDiaryOpen && (
        <>
          {/* 풀스크린 배경 오버레이 (z-index 99) */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[99]" onClick={() => setIsDiaryOpen(false)} />

          {/* 모달 컨테이너: 오버레이보다 높은 z-index (100) */}
          <div className="fixed inset-0 flex items-center justify-center z-[100]">
            <DiaryModal onClose={() => setIsDiaryOpen(false)} />
          </div>
        </>
      )}

      {/* 모바일 오버레이 */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[40]" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}


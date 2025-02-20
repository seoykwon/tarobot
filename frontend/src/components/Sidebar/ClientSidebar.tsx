"use client"

import { useState, useEffect } from "react"
import DiaryModal from "@/components/Diary/Diary"
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
        className={`fixed top-0 left-0 h-full bg-[#f0f4f9] transition-all duration-300 z-50 flex flex-col
          ${isMobile ? (isOpen ? "w-64" : "w-0") : isOpen ? "w-64" : "w-[54px]"}
          ${!isOpen && isMobile ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
      >
        <div className="flex h-14 items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-2xl focus:outline-none hover:bg-gray-200 transition h-14 w-14 flex items-center justify-center rounded-full"
          >
            ☰
          </button>
          <span className="px-4 md:hidden">미루</span>
        </div>

        {/* 컨텐츠 영역 - isOpen 상태와 관계없이 항상 렌더링하되 visibility로 제어 */}
        <div className={`flex flex-col flex-1 min-h-0 ${!isOpen ? "invisible" : ""}`}>
          {/* 스크롤 가능한 컨텐츠 영역 */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {children}
          </div>

        </div>
      </div>

      {/* 다이어리 모달: 배경 오버레이와 모달 컨테이너로 분리 */}
      {isDiaryOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[99]" onClick={() => setIsDiaryOpen(false)} />
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
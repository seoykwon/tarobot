"use client"

import { useState } from "react";

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  return (
    <div className={`fixed left-0 top-0 h-screen bg-white shadow-md transition-all duration-300 ${isOpen ? "w-64" : "w-16"}`}>
      {/* 햄버거 버튼 */}
      <button 
        className="text-2xl p-2 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* 사이드바 내용 (접었을 때 숨김) */}
      {isOpen && (
        <div className="p-4">
          <ul>
            <li className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">👤 타로 마스터 1</li>
            <li className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">👤 타로 마스터 2</li>
            <li className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">🔍 다른 타로 마스터 찾기</li>
          </ul>
          <h3 className="mt-4 text-lg font-semibold">최근</h3>
          <ul>
            <li className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">💬 간단한 인사 나누기</li>
          </ul>
        </div>
      )}
    </div>
  );
}
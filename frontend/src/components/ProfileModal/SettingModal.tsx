"use client";

import React, { useState, useRef, useEffect } from "react";
import ProfileSettings from "./ProfileSettings"; // ProfileSettings 경로에 맞게 수정

interface Tab {
  id: string;
  label: string;
}

const tabs: Tab[] = [
  { id: "profile", label: "내 정보" },
  { id: "ai", label: "AI" },
];

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("profile");
  const modalRef = useRef<HTMLDivElement>(null);

  // 모달 외부 클릭 시 닫기
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  // 외부 클릭 감지 이벤트 등록
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  },);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* 모달 배경 */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div
        ref={modalRef}
        className="relative bg-white w-[90%] max-w-4xl h-[80%] p-6 rounded-lg shadow-lg z-10 flex"
      >
        {/* 우측 상단 X 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
          aria-label="Close Modal"
        >
          ✕
        </button>
        {/* 사이드바 */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
        {/* 콘텐츠 영역 */}
        <ContentArea activeTab={activeTab} />
      </div>
    </div>
  );
}

function Sidebar({
  activeTab,
  setActiveTab,
  tabs,
}: {
  activeTab: string;
  setActiveTab: (id: string) => void;
  tabs: Tab[];
}) {
  return (
    <div className="w-1/5 border-r pr-4 overflow-y-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`cursor-pointer p-2 mb-2 rounded ${
            activeTab === tab.id ? "bg-blue-100 font-bold" : "text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
}

function ContentArea({ activeTab }: { activeTab: string }) {
  return (
    <div className="w-4/5 pl-4 overflow-y-auto">
      {activeTab === "profile" && <ProfileSettings />}
      {activeTab === "ai" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">AI 설정</h2>
          <p>여기에 AI 관련 기능이나 옵션 내용을 추가할 수 있습니다.</p>
        </div>
      )}
    </div>
  );
}
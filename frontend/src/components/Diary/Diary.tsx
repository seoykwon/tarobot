// components/Diary.tsx
"use client";

import { useState } from "react";
import Calendar from "./Calendar";
import RecordList from "./RecordList";
import useMediaQuery from "./useMediaQuery";

interface DiaryProps {
  onClose: () => void;
}

export default function Diary({ onClose }: DiaryProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showOverlay, setShowOverlay] = useState<boolean>(false);

  // 모바일: 화면 폭 768px 이하일 때
  const isMobile = useMediaQuery("(max-width: 768px)");

  // 모바일에서 날짜 클릭 시 오버레이를 열기 위한 콜백
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    if (isMobile) {
      setShowOverlay(true);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className={`relative bg-white rounded-lg shadow-lg w-full ${
          isMobile ? "max-w-[90vw] max-h-[90vh]" : "max-w-[80vw] max-h-[90vh]"
        } ${isMobile ? "" : "flex flex-col md:flex-row"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 z-10"
          onClick={onClose}
        >
          ✖
        </button>

        {/* 왼쪽: Calendar 영역 */}
        <div className={`w-full ${isMobile ? "" : "md:w-2/3 lg:w-2/3"} p-6 flex-none overflow-hidden`}>
          <Calendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onDateClick={handleDateClick} // 모바일에서 날짜 선택 시 오버레이 실행
          />
        </div>

        {/* 데스크탑: 오른쪽 RecordList 영역 */}
        {!isMobile && (
          <div className="w-full md:w-1/3 lg:w-1/3 flex-1 overflow-y-auto bg-gray-100 mt-4 md:mt-0 md:ml-4 p-2 md:p-4 shadow-md rounded-lg">
            <div className="pt-12">
              <RecordList selectedDate={selectedDate} />
            </div>
          </div>
        )}
      </div>

      {/* 모바일: 날짜 선택 시 오버레이로 RecordList 표시 */}
      {isMobile && showOverlay && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-60"
          onClick={() => setShowOverlay(false)}
        >
          <div
            className="relative bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 z-[70]"
              onClick={(e) => {e.stopPropagation(); setShowOverlay(false)}}
            >
              ✖
            </button>
            <RecordList selectedDate={selectedDate} />
          </div>
        </div>
      )}
    </div>
  );
}

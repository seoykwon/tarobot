"use client";

import { useState, useEffect } from "react";

interface CalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  onDateClick?: (date: Date) => void;
}

interface DayInfo {
  day: number;
  botNumber: number | null;
}

export default function Calendar({ selectedDate, setSelectedDate }: CalendarProps) {
  const [daysInfo, setDaysInfo] = useState<DayInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const generateDummyData = (year: number, month: number): DayInfo[] => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, index) => ({
      day: index + 1,
      botNumber: (index + 1) % 5 === 0 ? Math.floor(Math.random() * 2) + 1 : null
    }));
  };

  useEffect(() => {
    const fetchCalendarData = async () => {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/v1/diary/calendar?year=${year}&month=${month}`,
          { method: "GET", credentials: "include" }
        );

        if (response.ok) {
          const data = await response.json();
          setDaysInfo(data.days);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("API 호출 실패, 더미 데이터 사용:", error);
        setDaysInfo(generateDummyData(year, month));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendarData();
  }, [selectedDate]);

  const getDaysInMonth = (date: Date) => 
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) => 
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDayOfMonth = getFirstDayOfMonth(selectedDate);
    const days = [];

    // 수정 부분: 빈 칸에 aspect-square 추가
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square bg-gray-50"></div>
      );
    }

    // 수정 부분: 날짜 셀 스타일 전체 변경
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        i
      );
      const isSelected = currentDate.toDateString() === selectedDate.toDateString();
      const botNumber = daysInfo.find(d => d.day === i)?.botNumber;

      days.push(
        <div
          key={i}
          className={`aspect-square p-1 flex flex-col items-start justify-start cursor-pointer
            border border-gray-200 transition-all
            ${isSelected ? "bg-blue-100 border-blue-400" : "hover:bg-gray-50"}
            relative`}
          onClick={() => setSelectedDate(currentDate)}
        >
          {/* 수정 부분: 텍스트 크기 조정 */}
          <span className={`text-xs font-semibold 
            ${isSelected ? "text-blue-600" : "text-gray-600"}`}>
            {i}
          </span>

          {/* 수정 부분: 상단 여백 추가 및 폰트 크기 조정 */}
          {botNumber !== null && (
            <div className="absolute inset-0 flex items-center justify-center top-2">
              <span className="text-lg font-bold text-purple-600 
                animate-[pulse_1.5s_ease-in-out_infinite]">
                🤖{botNumber}
              </span>
            </div>
          )}

          {/* 수정 부분: 로딩 스피너 크기 조정 */}
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 
              flex items-center justify-center">
              <div className="loading loading-spinner loading-xs text-blue-500"></div>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      {/* 월 선택 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="text-xl font-bold text-gray-800">
          {MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
        </h2>
        
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 요일 표시 */}
      {/* 수정 부분: 그리드 행 설정 추가 */}
      <div className="grid grid-cols-7 gap-px mb-1 bg-gray-200">
        {DAYS.map(day => (
          <div 
            key={day}
            className="h-10 bg-white flex items-center justify-center text-sm font-medium"
          >
            <span className={day === 'Sun' ? 'text-red-500' : day === 'Sat' ? 'text-blue-500' : 'text-gray-600'}>
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* 수정 부분: auto-rows 클래스 추가 */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 auto-rows-[minmax(0,_1fr)]">
        {renderCalendarDays()}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { API_URLS } from "@/config/api";
import Image from "next/image";

interface CalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  onDateClick?: (date: Date) => void;
}

interface DayInfo {
  day: number;
  botNumbers: number[]; // 각 날짜에 해당하는 봇들의 ID 배열 (없으면 빈 배열)
}

export default function Calendar({ selectedDate, setSelectedDate, onDateClick }: CalendarProps) {
  const [daysInfo, setDaysInfo] = useState<DayInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const fetchCalendarData = async () => {
      const yearQuery = selectedDate.getFullYear();
      const monthQuery = selectedDate.getMonth() + 1; // 백엔드 API는 1월을 1로 인식하도록 전달
      try {
        setIsLoading(true);
        const response = await fetch(
          `${API_URLS.CALENDAR.MONTHLY(yearQuery, monthQuery)}`,
          { method: "GET", 
            credentials: "include" }
        );

        if (response.ok) {
          const data = await response.json();
          // API에서 전달되는 데이터는 key가 날짜(혹은 additionalProp1처럼 key에 숫자가 포함)이고,
          // value가 봇 ID 배열로 구성된 형태라고 가정합니다.
          const daysData: DayInfo[] = Object.entries(data).map(([key, value]) => {
            let day = parseInt(key, 10);
            if (isNaN(day)) {
              // key가 "additionalProp1"과 같이 숫자가 포함된 문자열일 경우 숫자만 추출
              const match = key.match(/\d+/);
              day = match ? parseInt(match[0], 10) : 0;
            }
            return {
              day,
              botNumbers: Array.isArray(value) ? value : []
            };
          });
          setDaysInfo(daysData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendarData();
  }, [selectedDate]);

  // 날짜 가져오기
  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  // 해당 월의 1일 가져오기
  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  // 저번 달로 이동하기
  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  };
  // 다음 달로 이동하기
  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  };
  // 달력 렌더링
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDayOfMonth = getFirstDayOfMonth(selectedDate);
    const days = [];

    // 빈 칸 렌더링 (월 시작 전)
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square bg-gray-50"></div>
      );
    }

    // 날짜 셀 렌더링
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i);
      const isSelected = currentDate.toDateString() === selectedDate.toDateString();
      const dayInfo = daysInfo.find(d => d.day === i);
      const botNumbers = dayInfo ? dayInfo.botNumbers : [];

      days.push(
        <div
          key={i}
          className={`aspect-square p-1 flex flex-col items-start justify-start cursor-pointer
            border border-gray-200 transition-all
            ${isSelected ? "bg-blue-100 border-blue-400" : "hover:bg-gray-50"}
            relative`}
          onClick={() => {
            setSelectedDate(currentDate);
            if (onDateClick) onDateClick(currentDate);
          }}
        >
          <span className={`text-xs font-semibold ${isSelected ? "text-blue-600" : "text-gray-600"}`}>
            {i}
          </span>

          {botNumbers.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center top-2 space-x-1">
              <Image
                src="/approved.svg"
                alt="Bot Icon"
                width={24}
                height={24}
              />
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
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
      {/* 상단: 월 선택 헤더 */}
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
      <div className="grid grid-cols-7 gap-px mb-1 bg-gray-200">
        {DAYS.map(day => (
          <div key={day} className="h-10 bg-white flex items-center justify-center text-sm font-medium">
            <span className={day === "Sun" ? "text-red-500" : day === "Sat" ? "text-blue-500" : "text-gray-600"}>
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 auto-rows-[minmax(0,_1fr)]">
        {renderCalendarDays()}
      </div>
    </div>
  );
}
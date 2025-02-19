"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { API_URLS } from "@/config/api";

interface TarotSummary {          // 타로 요약 데이터
  id: number;
  consultDate: string;
  tag: string;
  title: string;
  summary: string;
  cardImageUrl: string;
  tarotBotId: number;
  createdAt: string;
  updatedAt: string;
}

interface RecordListProps {     // 선택된 날짜 Props
  selectedDate: Date;
}

export default function RecordList({ selectedDate }: RecordListProps) {
  const [tarotData, setTarotData] = useState<TarotSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 해당 날짜의 요약 데이터 가져오는 함수
  const fetchRecords = async (date: Date) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const formattedDate = date.toISOString().split("T")[0];
      const response = await fetch(
        `${API_URLS.CALENDAR.SUMMARY(formattedDate)}`, 
        { method: "GET",
          credentials: "include" },
      );
      if (!response.ok) throw new Error("데이터 조회 실패");
      const data: TarotSummary[] = await response.json();
      setTarotData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류 발생");
    } finally {
      setIsLoading(false);
    }
  };

  // selectedDate 변경 시 해당 날짜의 상담 내역으로 갱신
  useEffect(() => {
    fetchRecords(selectedDate);
  }, [selectedDate]);

  // 날짜 형식 변경
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="w-full h-full flex flex-col rounded-lg pt-4">
      <h3 className="text-xl md:text-2xl font-semibold text-center mb-4">상담 내역</h3>
      <div className="flex-1 overflow-y-auto px-2 sm:px-4">
        {isLoading ? (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-md md:loading-lg text-primary"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error shadow-lg mx-2 sm:mx-4">
            <span>{error}</span>
          </div>
        ) : tarotData.length > 0 ? (
          tarotData.map((tarot) => (
            <div
              key={tarot.id}
              className="border rounded-lg shadow-sm p-3 sm:p-4 mb-4 bg-white hover:shadow-md transition-shadow mx-2 sm:mx-0"
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative w-full sm:w-[30%] aspect-[3/5] flex-shrink-0">
                  <Image
                    src={tarot.cardImageUrl}
                    alt={tarot.title}
                    fill
                    className="object-cover rounded-lg border"
                    sizes="(max-width: 640px) 90vw, 30vw"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="badge badge-outline badge-primary text-xs sm:text-sm">
                      {tarot.tag}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500">
                      {formatTime(tarot.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold mb-1 line-clamp-2">
                    {tarot.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {tarot.summary}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-2">상담 기록이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}

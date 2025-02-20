"use client";

import { useEffect, useState } from "react";
import { API_URLS } from "@/config/api";
import Image from "next/image";
import TarotDetailModal, { TarotSummary } from "@/components/Diary/TarotDetailModal";

interface RecordListProps {
  selectedDate: Date;
}

export default function RecordList({ selectedDate }: RecordListProps) {
  const [tarotData, setTarotData] = useState<TarotSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTarot, setSelectedTarot] = useState<TarotSummary | null>(null);

  // 데이터 가져오기
  const fetchRecords = async (date: Date) => {
    try {
      setIsLoading(true);

      // 한국 시간으로 변환
      const offsetDate = new Date(date.getTime() + 9 * 60 * 60 * 1000); // UTC+9
      const formattedDate = offsetDate.toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식

      // API 요청
      const apiUrl = API_URLS.CALENDAR.SUMMARY(formattedDate);

      const response = await fetch(apiUrl, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 404) {
        // 데이터가 없는 경우 빈 배열 설정
        setTarotData([]);
        return;
      }

      if (!response.ok) throw new Error("데이터 조회 실패");

      const data: TarotSummary[] = await response.json();
      setTarotData(data);
    } catch {
      
    } finally {
      setIsLoading(false);
    }
  };

  // 날짜 변경 시 데이터 갱신
  useEffect(() => {
    fetchRecords(selectedDate);
  }, [selectedDate]);

  // 출력할때 날짜 보기 편하게 하기 위한 함수
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    // 한국 시간으로 변환
    const offsetDate = new Date(date.getTime() + 9 * 60 * 60 * 1000); // UTC+9

    return offsetDate.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="w-full h-full flex flex-col rounded-lg pt-4 relative">
      <h3 className="text-xl md:text-2xl font-semibold text-center mb-4">상담 내역</h3>
      
      <div className="flex-1 overflow-y-auto px-2 sm:px-4">
        {/* 로딩 중일 경우 */}
        {isLoading ? (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-md md:loading-lg text-primary"></span>
          </div>
        ) : tarotData.length > 0 ? (
          // 상담 기록이 있을 경우
          tarotData.map(tarot => (
            <div
              key={tarot.id}
              className="border rounded-lg shadow-sm p-3 sm:p-4 mb-4 bg-white hover:shadow-md transition-shadow mx-2 sm:mx-0 cursor-pointer"
              onClick={() => setSelectedTarot(tarot)}
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
          // 상담 기록이 없을 경우
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
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-2">상담 내역이 없습니다</p>
          </div>
        )}
      </div>

      {/* 상담 상세 정보 오버레이 */}
      {selectedTarot && (
        <TarotDetailModal
          tarot={selectedTarot}
          onClose={() => setSelectedTarot(null)}
        />
      )}
    </div>
  );
}

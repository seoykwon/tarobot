// /components/RecordList.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import TarotDetailModal, { TarotSummary } from "@/components/Diary/TarotDetailModal";

interface RecordListProps {
  selectedDate: Date;
}

// 테스트를 위해 임시 데이터 2개 작성
const temporaryTarotData: TarotSummary[] = [
  {
    id: 1,
    consultDate: "2025-02-19",
    tag: "운세",
    title: "첫 번째 상담",
    summary: "첫 번째 상담의 요약입니다. 첫 번째 상담의 요약입니다. 첫 번째 상담의 요약입니다. 첫 번째 상담의 요약입니다. 첫 번째 상담의 요약입니다. 첫 번째 상담의 요약입니다. 첫 번째 상담의 요약입니다. 첫 번째 상담의 요약입니다. 첫 번째 상담의 요약입니다. 첫 번째 상담의 요약입니다.",
    cardImageUrl: "/basic/maj0.svg",
    tarotBotId: 1,
    createdAt: "2025-02-19T12:00:00Z",
    updatedAt: "2025-02-19T12:00:00Z",
  },
  {
    id: 2,
    consultDate: "2025-02-19",
    tag: "연애",
    title: "두 번째 상담",
    summary: "두 번째 상담의 요약입니다.",
    cardImageUrl: "/basic/cups1.svg",
    tarotBotId: 1,
    createdAt: "2025-02-19T12:00:00Z",
    updatedAt: "2025-02-19T12:00:00Z",
  }
];

export default function RecordList({ selectedDate }: RecordListProps) {
  const [tarotData, setTarotData] = useState<TarotSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error] = useState<string | null>(null);
  const [selectedTarot, setSelectedTarot] = useState<TarotSummary | null>(null);

  // 테스트 목적으로 임시 데이터를 로드하는 함수
  const loadTemporaryData = () => {
    setTarotData(temporaryTarotData);
    setIsLoading(false);
  };

  useEffect(() => {
    // 실제 API 호출 대신 임시 데이터 적용
    loadTemporaryData();
  }, [selectedDate]);

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="w-full h-full flex flex-col rounded-lg pt-4 relative">
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

      {selectedTarot && (
        <TarotDetailModal
          tarot={selectedTarot}
          onClose={() => setSelectedTarot(null)}
        />
      )}
    </div>
  );
}

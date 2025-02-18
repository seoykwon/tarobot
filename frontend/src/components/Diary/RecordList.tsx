"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface TarotSummary {
  id: number;
  createdAt: string;
  consultDate: string;
  tag: string;
  title: string;
  summary: string;
  cardImageUrl: string;
}

interface RecordListProps {
  selectedDate: Date;
}

// 테스트 데이터 상수화
const TEST_DATA: TarotSummary[] = [
  {
    id: 1,
    createdAt: "2025-02-18T14:00:00Z",
    consultDate: "2025-02-18",
    tag: "사랑",
    title: "연인 관계 전망",
    summary: "현재 관계의 발전 가능성을 확인할 수 있는 타로 결과입니다. 상대방의 진심을 이해하는 데 도움이 될 것입니다.",
    cardImageUrl: "/basic/cups1.svg"
  },
  {
    id: 2,
    createdAt: "2025-02-18T15:30:00Z",
    consultDate: "2025-02-18",
    tag: "경력",
    title: "진로 선택 조언",
    summary: "새로운 직장 제안에 대한 판단을 돕는 타로 리딩. 위험 요소와 기회 요소를 종합적으로 분석했습니다.",
    cardImageUrl: "/basic/swords5.svg"
  },
  {
    id: 3,
    createdAt: "2025-02-18T17:45:00Z",
    consultDate: "2025-02-18",
    tag: "재정",
    title: "재무 상태 점검",
    summary: "다가올 3개월 간의 재정 흐름을 예측하는 타로 리딩. 투자 결정에 참고할 만한 중요한 정보를 포함하고 있습니다.",
    cardImageUrl: "/basic/pents3.svg"
  }
];

export default function RecordList({ selectedDate }: RecordListProps) {
  const [tarotData, setTarotData] = useState<TarotSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = async (date: Date) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 실제 API 호출 부분 (테스트시 주석 처리)
      /*
      const formattedDate = date.toISOString().split('T')[0];
      const response = await fetch(
        `/api/v1/diary/${formattedDate}`,
        { credentials: "include" }
      );

      if (!response.ok) throw new Error("데이터 조회 실패");
      const data = await response.json();
      setTarotData(data);
      */
      
      // 테스트 데이터 사용
      await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 테스트용 딜레이
      setTarotData(TEST_DATA.filter(item => 
        item.consultDate === date.toISOString().split('T')[0]
      ));

    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류 발생");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(selectedDate);
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
              {/* 변경된 부분: 유동적인 flex 레이아웃 */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* 이미지 영역 - 너비 자동 조정 */}
                <div className="relative w-full sm:w-[30%] aspect-[3/5] flex-shrink-0">
                  <Image
                    src={tarot.cardImageUrl}
                    alt={tarot.title}
                    fill
                    className="object-cover rounded-lg border"
                    sizes="(max-width: 640px) 90vw, 30vw"
                  />
                </div>

                {/* 텍스트 컨텐츠 - 남은 공간 전체 사용 */}
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
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-2">상담 기록이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}

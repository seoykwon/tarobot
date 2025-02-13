"use client";

import Image from "next/image";

interface TarotSummary {
  id: number;
  consultDate: string;
  tag: string;
  title: string;
  summary: string;
  cardImageUrl: string;
}

interface RecordListProps {
  selectedDate: Date;
  tarotData: TarotSummary[];
  isLoading: boolean;
}

export default function RecordList({ selectedDate, tarotData, isLoading }: RecordListProps) {
  // 로컬 날짜 포맷 함수 (YYYY-MM-DD)
  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="w-full overflow-y-auto px-4 h-full">
      <h3 className="text-base md:text-lg font-semibold mt-4 mb-4 text-center">
        📆 {formatDateLocal(selectedDate)}
      </h3>

      {isLoading ? (
        <p className="text-center text-sm md:text-base">Loading...</p>
      ) : tarotData.length > 0 ? (
        tarotData.map((tarot, index) => (
          <div key={index} className="border rounded-lg shadow-md p-2 md:p-4 mb-4 bg-white">
            <div className="flex items-start gap-2 md:gap-4">
              {/* 반응형 이미지 컨테이너: width에 따른 3:5 비율 유지 */}
              <div className="relative w-24 md:w-[140px] aspect-[3/5] flex-shrink-0">
                <Image
                  src={tarot.cardImageUrl}
                  alt={tarot.title}
                  fill
                  className="object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2">{tarot.title}</h3>
                <p className="text-xs md:text-sm text-gray-700">{tarot.summary}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center text-sm md:text-base">
          선택한 날짜에 대한 데이터가 없습니다.
        </p>
      )}
    </div>
  );
}

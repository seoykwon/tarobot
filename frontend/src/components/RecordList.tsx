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
      <h3 className="text-lg font-semibold mt-4 text-center">
        📆 {formatDateLocal(selectedDate)}
      </h3>

      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : tarotData.length > 0 ? (
        tarotData.map((tarot, index) => (
          <div key={index} className="border rounded-lg shadow-md p-4 mb-4 bg-white">
            <h3 className="text-lg font-bold mb-2">{tarot.title}</h3>

            <div className="flex items-start gap-4">
              <Image
                src={tarot.cardImageUrl}
                alt={tarot.title}
                width={140}
                height={210}
                className="object-cover rounded-lg shadow-md"
              />

              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-semibold">Tag:</span> {tarot.tag}
                </p>
                <p className="text-gray-700">{tarot.summary}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Date of Fortune: {tarot.consultDate}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">선택한 날짜에 대한 데이터가 없습니다.</p>
      )}
    </div>
  );
}

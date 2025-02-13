"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { API_URLS } from "@/config/api";
import Image from "next/image";

interface TarotSummary {
  id: number;
  consultDate: string;
  tag: string;
  title: string;
  summary: string;
  cardImageUrl: string;
}

export default function DiaryModal({ onClose }: { onClose: () => void }) {
  const getSeoulDate = () => {
    const now = new Date();
    return new Date(now.getTime() + 9 * 60 * 60 * 1000);
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState<Date>(getSeoulDate());
  const [tarotData, setTarotData] = useState<TarotSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    fetchTarotData(getSeoulDate());
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    fetchTarotData(selectedDate);
  }, [selectedDate]);

  const fetchTarotData = async (date: Date) => {
    try {
      setIsLoading(true);
      const formattedDate = formatDate(date);
      const response = await fetch(API_URLS.CALENDAR.SUMMARY(formattedDate), {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tarot data");
      }

      const data: TarotSummary[] | null = await response.json();
      setTarotData(Array.isArray(data) && data.length > 0 ? data : []);
    } catch (error) {
      console.error("Error fetching tarot data:", error);
      setTarotData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose} // ✅ 오버레이 클릭 시 닫기
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl h-[90vh] flex"
        onClick={(e) => e.stopPropagation()} // ✅ 모달 내부 클릭 시 닫히지 않도록 함
      >
        {/* ✅ 좌측: 캘린더 (고정) */}
        <div className="w-1/3 bg-gray-100 p-4 shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">📅 다이어리</h2>

          <div className="flex justify-between items-center mb-4">
            <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))} className="text-xl p-2">◀</button>
            <h2 className="text-xl font-bold text-gray-700">
              {selectedDate.toLocaleString("ko-KR", { month: "long", year: "numeric" })}
            </h2>
            <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))} className="text-xl p-2">▶</button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-lg font-bold">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
              <div key={idx} className={`py-2 ${day === "Sun" ? "text-red-500" : day === "Sat" ? "text-blue-500" : "text-gray-700"} bg-yellow-200 rounded-lg`}>
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 mt-2 text-center">
            {Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay() }).map((_, idx) => (
              <div key={`prev-${idx}`} className="text-gray-400">{new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 0).getDate() - idx}</div>
            ))}

            {Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate() }).map((_, day) => (
              <div
                key={day}
                className={`relative p-2 border rounded-lg cursor-pointer ${
                  selectedDate.getDate() === day + 1 ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                }`}
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day + 1))}
              >
                {day + 1}
              </div>
            ))}
          </div>
        </div>

        {/* ✅ 우측: 상담 기록 (스크롤 가능) */}
        <div className="w-2/3 overflow-y-auto px-4 h-full">
          <h3 className="text-lg font-semibold mt-4 text-center">📆 {formatDate(selectedDate)}</h3>

          {isLoading ? (
            <p className="text-center">Loading...</p>
          ) : tarotData.length > 0 ? (
            tarotData.map((tarot, index) => (
              <Card key={index} className="p-1 mb-2"> 
                <CardHeader>
                  <CardTitle className="font-tarobot-title">{tarot.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-start gap-4"> 
                  {/* 좌측: 카드 이미지 */}
                  <Image
                    src={tarot.cardImageUrl}
                    alt={tarot.title}
                    width={140} 
                    height={210} 
                    className="object-cover rounded-lg shadow-md"
                  />

                  {/* 우측: 제목 + 내용 */}
                  <div className="flex-1 text-left">
                    <p className="font-tarobot-tag text-sm text-muted-foreground mb-2">
                      Tag: {tarot.tag}
                    </p>
                    <p className="font-tarobot-description text-muted-foreground">
                      {tarot.summary}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Date of Fortune: {tarot.consultDate}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="font-tarobot-description text-muted-foreground text-center">
              선택한 날짜에 대한 데이터가 없습니다.
            </p>
          )}

          {/* ✅ 닫기 버튼 */}
          <div className="flex justify-end mt-4">
            <button className="px-4 py-2 bg-gray-500 text-white rounded-lg" onClick={onClose}>
              닫기
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

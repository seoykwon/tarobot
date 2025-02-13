import { useState, useEffect } from "react";
import { API_URLS } from "@/config/api";
import Calendar from "./Calendar";
import RecordList from "./RecordList";

export default function DiaryModal({ onClose }: { onClose: () => void }) {
  const getSeoulDate = () => new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
  const [selectedDate, setSelectedDate] = useState<Date>(getSeoulDate());
  const [tarotData, setTarotData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 로컬 날짜 포맷 함수 (YYYY-MM-DD)
  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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
    setIsLoading(true);
    try {
      const formattedDate = formatDateLocal(date);
      const res = await fetch(API_URLS.CALENDAR.SUMMARY(formattedDate), {
        method: "GET",
        credentials: "include",
      });
      setTarotData(res.ok ? await res.json() : []);
    } catch {
      setTarotData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl h-[90vh] flex"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-1/3">
          {/* 캘린더 너비 33% */}
          <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>
        <div className="w-2/3">
          {/* 상담 기록 너비 66% */}
          <RecordList selectedDate={selectedDate} tarotData={tarotData} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
